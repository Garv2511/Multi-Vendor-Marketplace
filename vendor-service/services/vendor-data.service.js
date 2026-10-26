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

export { getVendor };