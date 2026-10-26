import { approveVendor, rejectVendor, getAllPending } from "../services/admin.service.js";

const adminController = async (req, res) => {
    try {
        if (req.method === "GET") {
            const pendingVendors = await getAllPending();
            return res.status(200).json({
                message: "Pending vendors fetched successfully",
                data: pendingVendors
            });
        }

        const userId = req.body?.userId || req.query?.userId;
        const status = req.body?.status || req.query?.status;
        const action = req.body?.action || req.query?.action;

        if (!userId) {
            return res.status(400).json({
                message: "userId is required"
            });
        }

        const operation = (status || action || "").toLowerCase();

        let result;
        if (operation === "approved" || operation === "approve") {
            result = await approveVendor(userId);
        } else if (operation === "rejected" || operation === "reject") {
            result = await rejectVendor(userId);
        } else {
            return res.status(400).json({
                message: "Valid status or action is required ('approved' or 'rejected')"
            });
        }

        return res.status(result.statusCode || 200).json(result);
    } catch (error) {
        console.error("Error in adminController:", error);

        if (error.message === "Vendor not found") {
            return res.status(404).json({
                message: error.message
            });
        }

        return res.status(500).json({
            message: "Internal server error in adminController",
            error: error.message
        });
    }
};

export { adminController };
export default adminController;
