import Vendor, { User } from "../utils/db.js";
import { hashPassword } from "../utils/password.js";

// Approve a particular vendor
const approveVendor = async (userId) => {
    const vendor = await Vendor.findOne({ userId });
    if (!vendor) {
        throw new Error("Vendor not found");
    }
    vendor.status = "approved";
    await vendor.save();
    return { message: "Vendor approved successfully", statusCode: 200 };
};

// Reject a particular vendor
const rejectVendor = async (userId) => {
    const vendor = await Vendor.findOne({ userId });
    if (!vendor) {
        throw new Error("Vendor not found");
    }
    vendor.status = "rejected";
    await vendor.save();
    return { message: "Vendor rejected successfully", statusCode: 200 };
};

// Get all pending vendors
const getAllPending = async () => {
    const data = await Vendor.find({ status: "pending" });
    return data;
};

// Update vendor details (commission, status, etc.)
const updateVendor = async (userId, updateData) => {
    const vendor = await Vendor.findOne({ userId });
    if (!vendor) {
        throw new Error("Vendor not found");
    }

    if (updateData.status) vendor.status = updateData.status;
    if (updateData.commissionPct !== undefined) vendor.commissionPct = updateData.commissionPct;
    if (updateData.storeName) vendor.storeName = updateData.storeName;
    if (updateData.slug) vendor.slug = updateData.slug;
    if (updateData.payoutAccountId) vendor.payoutAccountId = updateData.payoutAccountId;
    if (updateData.kycDocs) vendor.kycDocs = updateData.kycDocs;
    if (updateData.password) {
        const hashedPassword = await hashPassword(updateData.password);
        vendor.password = hashedPassword;
        await User.updateOne({ userId }, { $set: { password: hashedPassword } });
    }

    await vendor.save();
    const vendorData = vendor.toObject ? vendor.toObject() : { ...vendor._doc };
    delete vendorData.password;

    return { message: "Vendor updated successfully", statusCode: 200, data: vendorData };
};

export {
    approveVendor,
    rejectVendor,
    getAllPending,
    updateVendor
};
