import {
    listVendorOrders,
    updateVendorOrderStatus
} from "../services/order.service.js";

export const getVendorOrdersController = async (req, res) => {
    try {
        const vendorUserId = req.user.userId;
        const orders = await listVendorOrders(vendorUserId);
        return res.status(200).json({
            message: "Vendor orders fetched successfully",
            data: orders
        });
    } catch (error) {
        console.error("Error in getVendorOrdersController:", error);
        return res.status(error.statusCode || 500).json({
            message: error.message || "Failed to fetch vendor orders"
        });
    }
};

export const updateVendorOrderStatusController = async (req, res) => {
    try {
        const vendorUserId = req.user.userId;
        const { orderId } = req.params;
        const { status } = req.body || {};

        if (!status) {
            return res.status(400).json({ message: "Status is required in request body" });
        }

        const updatedOrder = await updateVendorOrderStatus(vendorUserId, orderId, status);
        return res.status(200).json({
            message: `Order ${orderId} status successfully updated to '${status}'`,
            data: updatedOrder
        });
    } catch (error) {
        console.error("Error in updateVendorOrderStatusController:", error);
        return res.status(error.statusCode || 500).json({
            message: error.message || "Failed to update vendor order status"
        });
    }
};

