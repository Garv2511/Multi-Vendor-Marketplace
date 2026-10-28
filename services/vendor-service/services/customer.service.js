import mongoose from "mongoose";
import { Customer, SavedAddress } from "../utils/db.js";

const PROFILE_FIELDS = new Set(["displayName"]);
const ADDRESS_MUTABLE_FIELDS = new Set([
    "recipientName",
    "phone",
    "addressLine1",
    "addressLine2",
    "city",
    "state",
    "postalCode",
    "country",
    "label"
]);

const notFound = (message) => {
    const error = new Error(message);
    error.statusCode = 404;
    return error;
};

const invalidAddressId = () => {
    const error = new Error("Invalid address ID");
    error.statusCode = 400;
    return error;
};

const serializeProfile = (customer) => ({
    customerId: customer._id,
    userId: customer.userId,
    email: customer.email,
    displayName: customer.displayName || null,
    createdAt: customer.createdAt,
    updatedAt: customer.updatedAt
});

const serializeAddress = (address) => ({
    addressId: address.addressId,
    userId: address.userId,
    recipientName: address.recipientName,
    phone: address.phone,
    addressLine1: address.addressLine1,
    addressLine2: address.addressLine2 || null,
    city: address.city,
    state: address.state,
    postalCode: address.postalCode,
    country: address.country,
    label: address.label || null,
    isDefault: address.isDefault,
    createdAt: address.createdAt,
    updatedAt: address.updatedAt
});

const getCustomerProfile = async (userId) => {
    const customer = await Customer.findOne({ userId: Number(userId) }).lean();
    if (!customer) throw notFound("Customer profile not found");
    return serializeProfile(customer);
};

const updateCustomerProfile = async (userId, data) => {
    const fields = Object.keys(data || {});
    const invalidFields = fields.filter((field) => !PROFILE_FIELDS.has(field));
    if (invalidFields.length) {
        const error = new Error(`Protected or unsupported profile fields cannot be updated: ${invalidFields.join(", ")}`);
        error.statusCode = 400;
        throw error;
    }
    if (fields.length === 0) {
        const error = new Error("At least one editable profile field is required");
        error.statusCode = 400;
        throw error;
    }
    if (typeof data.displayName !== "string" || !data.displayName.trim() || data.displayName.trim().length > 120) {
        const error = new Error("displayName must be a non-empty string with at most 120 characters");
        error.statusCode = 400;
        throw error;
    }

    const customer = await Customer.findOneAndUpdate(
        { userId: Number(userId) },
        { $set: { displayName: data.displayName.trim() } },
        { new: true, runValidators: true }
    ).lean();
    if (!customer) throw notFound("Customer profile not found");
    return serializeProfile(customer);
};

const getAddress = async (userId, addressId) => {
    if (!mongoose.isValidObjectId(addressId)) throw invalidAddressId();
    const address = await SavedAddress.findOne({
        addressId,
        userId: Number(userId)
    }).lean();
    if (!address) throw notFound("Address not found");
    return serializeAddress(address);
};

const listAddresses = async (userId) => {
    const addresses = await SavedAddress.find({ userId: Number(userId) })
        .sort({ isDefault: -1, createdAt: -1, addressId: -1 })
        .lean();
    return addresses.map(serializeAddress);
};

const setDefaultAddress = async (userId, addressId) => {
    if (!mongoose.isValidObjectId(addressId)) throw invalidAddressId();
    const address = await SavedAddress.findOne({ addressId, userId: Number(userId) });
    if (!address) throw notFound("Address not found");

    await SavedAddress.updateMany(
        { userId: Number(userId), isDefault: true, addressId: { $ne: address.addressId } },
        { $set: { isDefault: false } }
    );
    try {
        address.isDefault = true;
        await address.save();
    } catch (error) {
        if (error.code === 11000) {
            const conflict = new Error("Address default changed concurrently; please retry");
            conflict.statusCode = 409;
            throw conflict;
        }
        throw error;
    }
    return serializeAddress(address.toObject());
};

const addAddress = async (userId, data) => {
    const suppliedFields = Object.keys(data || {});
    const invalidFields = suppliedFields.filter((field) => (
        !ADDRESS_MUTABLE_FIELDS.has(field) && field !== "isDefault"
    ));
    if (invalidFields.length) {
        const error = new Error(`Protected or unsupported address fields cannot be set: ${invalidFields.join(", ")}`);
        error.statusCode = 400;
        throw error;
    }
    if (data?.isDefault !== undefined && typeof data.isDefault !== "boolean") {
        const error = new Error("isDefault must be a boolean");
        error.statusCode = 400;
        throw error;
    }
    const normalized = validateAddress(data);
    const hasAddress = await SavedAddress.exists({ userId: Number(userId) });
    const address = await SavedAddress.create({
        ...normalized,
        userId: Number(userId),
        isDefault: false
    });

    if (Boolean(data.isDefault) || !hasAddress) {
        return setDefaultAddress(userId, address.addressId.toString());
    }
    return serializeAddress(address.toObject());
};

const updateAddress = async (userId, addressId, data) => {
    if (!mongoose.isValidObjectId(addressId)) throw invalidAddressId();
    const fields = Object.keys(data || {});
    const invalidFields = fields.filter((field) => !ADDRESS_MUTABLE_FIELDS.has(field) && field !== "isDefault");
    if (invalidFields.length) {
        const error = new Error(`Protected or unsupported address fields cannot be updated: ${invalidFields.join(", ")}`);
        error.statusCode = 400;
        throw error;
    }
    if (fields.length === 0) {
        const error = new Error("At least one editable address field is required");
        error.statusCode = 400;
        throw error;
    }
    if (data.isDefault !== undefined && typeof data.isDefault !== "boolean") {
        const error = new Error("isDefault must be a boolean");
        error.statusCode = 400;
        throw error;
    }

    const address = await SavedAddress.findOne({ addressId, userId: Number(userId) });
    if (!address) throw notFound("Address not found");
    const normalized = validateAddress(data, { partial: true });
    if (data.isDefault === false && address.isDefault) {
        const error = new Error("Set another address as default before unsetting this address");
        error.statusCode = 400;
        throw error;
    }
    Object.assign(address, normalized);
    await address.save();
    if (data.isDefault === true) return setDefaultAddress(userId, addressId);
    return serializeAddress(address.toObject());
};

const deleteAddress = async (userId, addressId) => {
    if (!mongoose.isValidObjectId(addressId)) throw invalidAddressId();
    const address = await SavedAddress.findOneAndDelete({ addressId, userId: Number(userId) });
    if (!address) throw notFound("Address not found");

    if (address.isDefault) {
        const replacement = await SavedAddress.findOne({ userId: Number(userId) })
            .sort({ createdAt: -1, addressId: -1 });
        if (replacement) {
            replacement.isDefault = true;
            await replacement.save();
        }
    }
    return { addressId: address.addressId };
};

const resolveOwnedAddress = async (userId, addressId) => {
    const address = await getAddress(userId, addressId);
    return address;
};

export {
    getCustomerProfile,
    updateCustomerProfile,
    listAddresses,
    addAddress,
    getAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
    resolveOwnedAddress,
    serializeAddress
};
