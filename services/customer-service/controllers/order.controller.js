import {
    createOrder,
    listOrders,
    getOrder,
    cancelOrder
} from "../services/order.service.js";
import { resolveOwnedAddress } from "../services/customer.service.js";
import { validateDeliveryAddress } from "../utils/order.validation.js";
import { parsePagination } from "../utils/catalog.validation.js";

export const createOrderController = async (req, res) => {
    try {
        const { savedAddressId, deliveryAddress } = req.body || {};

        if (savedAddressId && deliveryAddress) {
            return res.status(400).json({
                message: "Provide either savedAddressId or deliveryAddress, not both"
            });
        }

        let resolvedAddress;
        if (savedAddressId) {
            const rawAddress = await resolveOwnedAddress(req.user.userId, savedAddressId);
            resolvedAddress = validateDeliveryAddress(rawAddress);
        } else if (deliveryAddress) {
            resolvedAddress = validateDeliveryAddress(deliveryAddress);
        } else {
            return res.status(400).json({
                message: "Delivery address is required (provide savedAddressId or deliveryAddress)"
            });
        }

        const order = await createOrder(req.user.userId, resolvedAddress);
        return res.status(201).json({
            message: "Order placed successfully",
            data: order
        });
    } catch (error) {
        console.error("Error in createOrderController:", error);
        return res.status(error.statusCode || 500).json({
            message: error.message || "Failed to create order",
            details: error.details
        });
    }
};

export const listOrdersController = async (req, res) => {
    try {
        const { page = "1", pageSize } = req.query;
        const pagination = parsePagination({ page, pageSize });
        const result = await listOrders(req.user.userId, pagination.page, pagination.pageSize);
        return res.status(200).json({
            message: "Customer orders fetched successfully",
            data: result
        });
    } catch (error) {
        console.error("Error in listOrdersController:", error);
        return res.status(error.statusCode || 500).json({
            message: error.message || "Failed to fetch orders"
        });
    }
};

export const getOrderController = async (req, res) => {
    try {
        const order = await getOrder(req.user.userId, req.params.orderId);
        return res.status(200).json({
            message: "Order details fetched successfully",
            data: order
        });
    } catch (error) {
        console.error("Error in getOrderController:", error);
        return res.status(error.statusCode || 500).json({
            message: error.message || "Failed to fetch order details"
        });
    }
};

export const cancelOrderController = async (req, res) => {
    try {
        const order = await cancelOrder(req.user.userId, req.params.orderId);
        return res.status(200).json({
            message: "Order cancelled successfully",
            data: order
        });
    } catch (error) {
        console.error("Error in cancelOrderController:", error);
        return res.status(error.statusCode || 500).json({
            message: error.message || "Failed to cancel order"
        });
    }
};

