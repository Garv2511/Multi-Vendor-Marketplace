import { getVendor } from "../services/vendor-data.service.js";

const vendorDataController = async (req, res) => {
    try {
        const userId = req.params?.userId || req.query?.userId;
        const uuid = req.query?.uuid;

        if (!userId && !uuid) {
            return res.status(400).json({
                message: "userId parameter is required to fetch vendor data"
            });
        }

        const vendorData = await getVendor(uuid, userId);

        if (!vendorData) {
            return res.status(404).json({
                message: "Vendor not found"
            });
        }

        // Non-admin vendors are only permitted to access their own vendor record
        if (req.user && req.user.role !== "admin" && Number(vendorData.userId) !== Number(req.user.userId)) {
            return res.status(403).json({
                message: "Forbidden: You are only allowed to access your own vendor data"
            });
        }

        return res.status(200).json({
            message: "Vendor data fetched successfully",
            data: vendorData
        });
    } catch (error) {
        console.error("Error in vendorDataController:", error);
        return res.status(500).json({
            message: "Internal server error while fetching vendor data",
            error: error.message
        });
    }
};

export { vendorDataController };
export default vendorDataController;