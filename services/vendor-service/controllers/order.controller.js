import {
    createOrder,
    listOrders,
    getOrder,
    cancelOrder
} from "../services/order.service.js";
import { parsePagination } from "../utils/catalog.validation.js";
import { validateDeliveryAddress, validateOrderId } from "../utils/order.validation.js";

const userIdFromRequest = (req, res) => {
    const userId = req.user?.userId;
    if (userId === undefined || userId === null) {
        res.status(401).json({ message: "Authenticated customer identity is required" });
        return null;
    }
    return userId;
};

export const createOrderController = async (req, res) => {
    try {
        const userId = userIdFromRequest(req, res);
        if (userId === null) return;
        const deliveryAddress = validateDeliveryAddress(req.body?.deliveryAddress);
        const order = await createOrder(userId, deliveryAddress);
        return res.status(201).json({ message: "Order created successfully", data: order });
    } catch (error) {
        console.error("Error in createOrderController:", error);
        const response = { message: error.message || "Unable to create order" };
        if (error.details) response.details = error.details;
        return res.status(error.statusCode || 500).json(response);
    }
};

export const listOrdersController = async (req, res) => {
    try {
        const userId = userIdFromRequest(req, res);
        if (userId === null) return;
        const { page, pageSize } = parsePagination(req.query);
        const result = await listOrders(userId, page, pageSize);
        return res.status(200).json({ message: "Orders fetched successfully", data: result });
    } catch (error) {
        console.error("Error in listOrdersController:", error);
        return res.status(error.statusCode || 500).json({
            message: error.message || "Unable to fetch orders"
        });
    }
};

export const getOrderController = async (req, res) => {
    try {
        const userId = userIdFromRequest(req, res);
        if (userId === null) return;
        const order = await getOrder(userId, validateOrderId(req.params.orderId));
        return res.status(200).json({ message: "Order fetched successfully", data: order });
    } catch (error) {
        console.error("Error in getOrderController:", error);
        return res.status(error.statusCode || 500).json({
            message: error.message || "Unable to fetch order"
        });
    }
};

export const cancelOrderController = async (req, res) => {
    try {
        const userId = userIdFromRequest(req, res);
        if (userId === null) return;
        const order = await cancelOrder(userId, validateOrderId(req.params.orderId));
        return res.status(200).json({ message: "Order cancelled successfully", data: order });
    } catch (error) {
        console.error("Error in cancelOrderController:", error);
        return res.status(error.statusCode || 500).json({
            message: error.message || "Unable to cancel order"
        });
    }
};

export default {
    createOrderController,
    listOrdersController,
    getOrderController,
    cancelOrderController
};
