import Vendor from "../utils/db.js";

// Approve a particular vendor
const approveVendor = async (userId) => {
    const vendor = await Vendor.findOne({ userId })
    if (!vendor) {
        throw new Error("Vendor not found")
    }
    vendor.status = "approved"
    await vendor.save()
    return { message: "Vendor approved successfully", statusCode: 200 }
}

// Reject a particular vendor
const rejectVendor = async (userId) => {
    const vendor = await Vendor.findOne({ userId })
    if (!vendor) {
        throw new Error("Vendor not found")
    }
    vendor.status = "rejected"
    await vendor.save()
    return { message: "Vendor rejected successfully", statusCode: 200 }
}

// Get all pending vendors
const getAllPending = async () => {
    const data = await Vendor.find({ status: "pending" });
    return data;
}

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

    await vendor.save();
    return { message: "Vendor updated successfully", statusCode: 200, data: vendor };
}

export {
    approveVendor,
    rejectVendor,
    getAllPending,
    updateVendor
}