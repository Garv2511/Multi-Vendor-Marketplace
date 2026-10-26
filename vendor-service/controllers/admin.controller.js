import { approveVendor, rejectVendor, getAllPending } from "../services/admin.service.js";

const adminController = async (req, res) => {
    try {
        if (req.method === "GET" || req.path.includes("pending")) {
            const pendingVendors = await getAllPending();
            return res.status(200).json({
                message: "Pending vendors fetched successfully",
                data: pendingVendors
            });
        }

        // All POST request parameters come from req.body
        const { userId, status, action } = req.body || {};

        if (!userId) {
            return res.status(400).json({
                message: "userId is required in request body"
            });
        }

        const pathAction = req.path.includes("approve")
            ? "approved"
            : req.path.includes("reject")
            ? "rejected"
            : "";

        const operation = (pathAction || status || action || "").toLowerCase();

        let result;
        if (operation === "approved" || operation === "approve") {
            result = await approveVendor(userId);
        } else if (operation === "rejected" || operation === "reject") {
            result = await rejectVendor(userId);
        } else {
            return res.status(400).json({
                message: "Valid action ('approve' or 'reject') is required"
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
