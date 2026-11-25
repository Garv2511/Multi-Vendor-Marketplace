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
        .sort({ isDefault: -1, createdAt: -1 })
        .lean();
    return addresses.map(serializeAddress);
};

const addAddress = async (userId, validatedData) => {
    const numUserId = Number(userId);
    const existingCount = await SavedAddress.countDocuments({ userId: numUserId });
    const isDefault = existingCount === 0 ? true : Boolean(validatedData.isDefault);

    if (isDefault && existingCount > 0) {
        await SavedAddress.updateMany({ userId: numUserId, isDefault: true }, { $set: { isDefault: false } });
    }

    const address = await SavedAddress.create({
        ...validatedData,
        userId: numUserId,
        isDefault
    });

    return serializeAddress(address.toObject ? address.toObject() : address);
};

const updateAddress = async (userId, addressId, validatedData) => {
    if (!mongoose.isValidObjectId(addressId)) throw invalidAddressId();
    const numUserId = Number(userId);

    const existing = await SavedAddress.findOne({ addressId, userId: numUserId });
    if (!existing) throw notFound("Address not found");

    if (validatedData.isDefault === true && !existing.isDefault) {
        await SavedAddress.updateMany({ userId: numUserId, isDefault: true }, { $set: { isDefault: false } });
    } else if (validatedData.isDefault === false && existing.isDefault) {
        const error = new Error("Cannot unset default address directly; designate another address as default instead");
        error.statusCode = 400;
        throw error;
    }

    const updates = {};
    for (const field of ADDRESS_MUTABLE_FIELDS) {
        if (validatedData[field] !== undefined) {
            updates[field] = validatedData[field];
        }
    }
    if (validatedData.isDefault !== undefined) {
        updates.isDefault = validatedData.isDefault;
    }

    const updated = await SavedAddress.findOneAndUpdate(
        { addressId, userId: numUserId },
        { $set: updates },
        { new: true, runValidators: true }
    ).lean();

    return serializeAddress(updated);
};

const deleteAddress = async (userId, addressId) => {
    if (!mongoose.isValidObjectId(addressId)) throw invalidAddressId();
    const numUserId = Number(userId);

    const address = await SavedAddress.findOne({ addressId, userId: numUserId });
    if (!address) throw notFound("Address not found");

    const wasDefault = address.isDefault;
    await SavedAddress.deleteOne({ addressId, userId: numUserId });

    if (wasDefault) {
        const nextDefault = await SavedAddress.findOne({ userId: numUserId }).sort({ createdAt: -1 });
        if (nextDefault) {
            nextDefault.isDefault = true;
            await nextDefault.save();
        }
    }

    return { deleted: true, addressId };
};

const setDefaultAddress = async (userId, addressId) => {
    if (!mongoose.isValidObjectId(addressId)) throw invalidAddressId();
    const numUserId = Number(userId);

    const target = await SavedAddress.findOne({ addressId, userId: numUserId });
    if (!target) throw notFound("Address not found");

    if (!target.isDefault) {
        await SavedAddress.updateMany({ userId: numUserId, isDefault: true }, { $set: { isDefault: false } });
        target.isDefault = true;
        await target.save();
    }

    return serializeAddress(target.toObject ? target.toObject() : target);
};

const resolveOwnedAddress = async (userId, addressId) => {
    if (!mongoose.isValidObjectId(addressId)) throw invalidAddressId();
    const address = await SavedAddress.findOne({ addressId, userId: Number(userId) }).lean();
    if (!address) throw notFound("Selected delivery address does not exist");
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
    resolveOwnedAddress
};
export default {
    getCustomerProfile,
    updateCustomerProfile,
    listAddresses,
    addAddress,
    getAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
    resolveOwnedAddress
};

