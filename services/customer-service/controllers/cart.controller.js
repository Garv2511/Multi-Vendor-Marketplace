import {
    getCart,
    addCartItem,
    updateCartItem,
    removeCartItem,
    clearCart
} from "../services/cart.service.js";

export const getCartController = async (req, res) => {
    try {
        const cart = await getCart(req.user.userId);
        return res.status(200).json({
            message: "Cart retrieved successfully",
            data: cart
        });
    } catch (error) {
        console.error("Error in getCartController:", error);
        return res.status(error.statusCode || 500).json({
            message: error.message || "Failed to retrieve cart"
        });
    }
};

export const addCartItemController = async (req, res) => {
    try {
        const { productId, quantity = 1 } = req.body;
        const cart = await addCartItem(req.user.userId, productId, quantity);
        return res.status(200).json({
            message: "Item added to cart successfully",
            data: cart
        });
    } catch (error) {
        console.error("Error in addCartItemController:", error);
        return res.status(error.statusCode || 500).json({
            message: error.message || "Failed to add item to cart"
        });
    }
};

export const updateCartItemController = async (req, res) => {
    try {
        const { quantity } = req.body;
        const cart = await updateCartItem(req.user.userId, req.params.productId, quantity);
        return res.status(200).json({
            message: "Cart item updated successfully",
            data: cart
        });
    } catch (error) {
        console.error("Error in updateCartItemController:", error);
        return res.status(error.statusCode || 500).json({
            message: error.message || "Failed to update cart item"
        });
    }
};

export const removeCartItemController = async (req, res) => {
    try {
        const cart = await removeCartItem(req.user.userId, req.params.productId);
        return res.status(200).json({
            message: "Item removed from cart successfully",
            data: cart
        });
    } catch (error) {
        console.error("Error in removeCartItemController:", error);
        return res.status(error.statusCode || 500).json({
            message: error.message || "Failed to remove item from cart"
        });
    }
};

export const clearCartController = async (req, res) => {
    try {
        const cart = await clearCart(req.user.userId);
        return res.status(200).json({
            message: "Cart cleared successfully",
            data: cart
        });
    } catch (error) {
        console.error("Error in clearCartController:", error);
        return res.status(error.statusCode || 500).json({
            message: error.message || "Failed to clear cart"
        });
    }
};

