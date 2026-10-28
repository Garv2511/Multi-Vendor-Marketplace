import {
    getCart,
    addCartItem,
    updateCartItem,
    removeCartItem,
    clearCart
} from "../services/cart.service.js";

const getCustomerUserId = (req, res) => {
    const userId = req.user?.userId;
    if (userId === undefined || userId === null) {
        res.status(401).json({ message: "Authenticated customer identity is required" });
        return null;
    }
    return userId;
};

const validateProductId = (productId, res) => {
    if (typeof productId !== "string" || !productId.trim()) {
        res.status(400).json({ message: "productId is required" });
        return false;
    }
    return true;
};

const validateQuantity = (quantity, res) => {
    if (typeof quantity !== "number" || !Number.isInteger(quantity) || quantity <= 0) {
        res.status(400).json({ message: "quantity must be a positive integer" });
        return false;
    }
    return true;
};

export const getCartController = async (req, res) => {
    try {
        const userId = getCustomerUserId(req, res);
        if (userId === null) return;

        const cart = await getCart(userId);
        return res.status(200).json({ message: "Cart fetched successfully", data: cart });
    } catch (error) {
        console.error("Error in getCartController:", error);
        return res.status(error.statusCode || 500).json({
            message: error.message || "Internal server error while fetching cart"
        });
    }
};

export const addCartItemController = async (req, res) => {
    try {
        const userId = getCustomerUserId(req, res);
        if (userId === null) return;

        const { productId, quantity } = req.body || {};
        if (!validateProductId(productId, res) || !validateQuantity(quantity, res)) return;

        const cart = await addCartItem(userId, productId, quantity);
        return res.status(200).json({ message: "Cart item added successfully", data: cart });
    } catch (error) {
        console.error("Error in addCartItemController:", error);
        return res.status(error.statusCode || 500).json({
            message: error.message || "Internal server error while adding cart item"
        });
    }
};

export const updateCartItemController = async (req, res) => {
    try {
        const userId = getCustomerUserId(req, res);
        if (userId === null) return;

        const { productId } = req.params;
        const { quantity } = req.body || {};
        if (!validateProductId(productId, res) || !validateQuantity(quantity, res)) return;

        const cart = await updateCartItem(userId, productId, quantity);
        return res.status(200).json({ message: "Cart item updated successfully", data: cart });
    } catch (error) {
        console.error("Error in updateCartItemController:", error);
        return res.status(error.statusCode || 500).json({
            message: error.message || "Internal server error while updating cart item"
        });
    }
};

export const removeCartItemController = async (req, res) => {
    try {
        const userId = getCustomerUserId(req, res);
        if (userId === null) return;

        const { productId } = req.params;
        if (!validateProductId(productId, res)) return;

        const cart = await removeCartItem(userId, productId);
        return res.status(200).json({ message: "Cart item removed successfully", data: cart });
    } catch (error) {
        console.error("Error in removeCartItemController:", error);
        return res.status(error.statusCode || 500).json({
            message: error.message || "Internal server error while removing cart item"
        });
    }
};

export const clearCartController = async (req, res) => {
    try {
        const userId = getCustomerUserId(req, res);
        if (userId === null) return;

        const cart = await clearCart(userId);
        return res.status(200).json({ message: "Cart cleared successfully", data: cart });
    } catch (error) {
        console.error("Error in clearCartController:", error);
        return res.status(error.statusCode || 500).json({
            message: error.message || "Internal server error while clearing cart"
        });
    }
};

export default {
    getCartController,
    addCartItemController,
    updateCartItemController,
    removeCartItemController,
    clearCartController
};
