import { getVendor } from "../services/vendor-data.service.js";

const vendorDataController = async (req, res) => {
    try {
        const uuid = req.query.uuid || req.body?.uuid;
        const userId = req.query.userId || req.body?.userId;

        if (!uuid && !userId) {
            return res.status(400).json({
                message: "Please provide either uuid or userId to fetch vendor data"
            });
        }

        const vendorData = await getVendor(uuid, userId);

        if (!vendorData) {
            return res.status(404).json({
                message: "Vendor not found"
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