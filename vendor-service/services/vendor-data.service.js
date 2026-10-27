import Vendor from "../utils/db.js";

const getVendor = async (uuid, userId) => {
    try {
        const query = {};
        if (uuid) {
            query.uuid = uuid;
        }
        if (userId !== undefined && userId !== null && userId !== "") {
            query.userId = Number(userId);
        }

        if (Object.keys(query).length === 0) {
            return null;
        }

        const vendor = await Vendor.findOne(query);
        return vendor;
    } catch (error) {
        console.error("Error in getVendor service:", error);
        throw error;
    }
};

const updateVendorProfile = async (userId, updateData) => {
    try {
        const vendor = await Vendor.findOne({ userId: Number(userId) });
        if (!vendor) {
            const error = new Error("Vendor profile not found");
            error.statusCode = 404;
            throw error;
        }

        if (updateData.storeName !== undefined) vendor.storeName = updateData.storeName;
        if (updateData.slug !== undefined) vendor.slug = updateData.slug;
        if (updateData.payoutAccountId !== undefined) vendor.payoutAccountId = updateData.payoutAccountId;
        if (updateData.kycDocs !== undefined) {
            vendor.kycDocs = Array.isArray(updateData.kycDocs) ? updateData.kycDocs : [updateData.kycDocs];
        }

        await vendor.save();

        const vendorData = vendor.toObject ? vendor.toObject() : { ...vendor._doc };
        delete vendorData.password;

        return {
            message: "Vendor profile updated successfully",
            statusCode: 200,
            data: vendorData
        };
    } catch (error) {
        console.error("Error in updateVendorProfile service:", error);
        throw error;
    }
};

export { getVendor, updateVendorProfile };
export default { getVendor, updateVendorProfile };
