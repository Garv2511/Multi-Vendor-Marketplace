import mongoose from "mongoose";
import { Cart, Product, Vendor } from "../utils/db.js";
import { isPositiveInteger, isValidProductIdInput } from "../utils/cart.validation.js";

const notFound = (message) => {
    const error = new Error(message);
    error.statusCode = 404;
    return error;
};

const conflict = (message) => {
    const error = new Error(message);
    error.statusCode = 409;
    return error;
};

const badRequest = (message) => {
    const error = new Error(message);
    error.statusCode = 400;
    return error;
};

const validateProductId = (productId) => {
    if (!isValidProductIdInput(productId) || !mongoose.isValidObjectId(productId)) {
        throw badRequest("Invalid product ID");
    }
};

const validateQuantity = (quantity) => {
    if (!isPositiveInteger(quantity)) {
        throw badRequest("quantity must be a positive integer");
    }
};

const serializeCart = async (cart) => {
    if (!cart || cart.items.length === 0) {
        return {
            items: [],
            totalItems: 0,
            subtotal: 0,
            currency: "USD"
        };
    }

    const productIds = cart.items.map((item) => item.productId);
    const products = await Product.find({ _id: { $in: productIds } }).lean();
    const approvedVendors = await Vendor.find({
        userId: { $in: products.map((p) => p.vendorId) },
        status: "approved"
    }).select("userId storeName").lean();

    const productsById = new Map(products.map((p) => [p._id.toString(), p]));
    const vendorsById = new Map(approvedVendors.map((v) => [v.userId, v]));

    let subtotalCents = 0;
    let totalItems = 0;

    const items = cart.items.map((item) => {
        const product = productsById.get(item.productId.toString());
        const vendor = product ? vendorsById.get(product.vendorId) : null;
        const isAvailable = Boolean(product && vendor && product.stockQuantity > 0);
        const unitPrice = product ? product.price : 0;
        const lineTotal = isAvailable ? Number((unitPrice * item.quantity).toFixed(2)) : 0;

        if (isAvailable) {
            subtotalCents += Math.round(unitPrice * 100) * item.quantity;
            totalItems += item.quantity;
        }

        return {
            productId: item.productId.toString(),
            quantity: item.quantity,
            title: product?.title || "Unavailable Product",
            price: unitPrice,
            lineTotal,
            image: product?.images?.[0] || null,
            storeName: vendor?.storeName || "Unknown Vendor",
            vendorId: product?.vendorId || null,
            stockQuantity: product ? product.stockQuantity : 0,
            isAvailable
        };
    });

    return {
        items,
        totalItems,
        subtotal: Number((subtotalCents / 100).toFixed(2)),
        currency: "USD"
    };
};

const getCart = async (userId) => {
    const cart = await Cart.findOne({ userId: Number(userId) }).lean();
    return serializeCart(cart);
};

const getOrCreateCart = async (userId) => {
    let cart = await Cart.findOne({ userId: Number(userId) });
    if (!cart) {
        cart = await Cart.create({ userId: Number(userId), items: [] });
    }
    return cart;
};

const verifyProductAvailability = async (productId, requestedQuantity) => {
    const product = await Product.findById(productId).lean();
    if (!product) throw notFound("Product not found");

    const vendor = await Vendor.findOne({
        userId: product.vendorId,
        status: "approved"
    }).select("userId").lean();
    if (!vendor) throw conflict("Product belongs to an unapproved vendor");

    if (product.stockQuantity < requestedQuantity) {
        throw conflict(`Only ${product.stockQuantity} unit(s) available in stock`);
    }

    return product;
};

const addCartItem = async (userId, productId, quantity = 1) => {
    validateProductId(productId);
    validateQuantity(quantity);

    const cart = await getOrCreateCart(userId);
    const existingIndex = cart.items.findIndex(
        (item) => item.productId.toString() === productId
    );

    const totalRequested = (existingIndex >= 0 ? cart.items[existingIndex].quantity : 0) + quantity;
    await verifyProductAvailability(productId, totalRequested);

    if (existingIndex >= 0) {
        cart.items[existingIndex].quantity = totalRequested;
    } else {
        cart.items.push({
            productId: new mongoose.Types.ObjectId(productId),
            quantity
        });
    }

    await cart.save();
    return serializeCart(cart.toObject ? cart.toObject() : cart);
};

const updateCartItem = async (userId, productId, quantity) => {
    validateProductId(productId);
    validateQuantity(quantity);

    const cart = await Cart.findOne({ userId: Number(userId) });
    if (!cart) throw notFound("Cart is empty");

    const item = cart.items.find((i) => i.productId.toString() === productId);
    if (!item) throw notFound("Product not found in cart");

    await verifyProductAvailability(productId, quantity);

    item.quantity = quantity;
    await cart.save();
    return serializeCart(cart.toObject ? cart.toObject() : cart);
};

const removeCartItem = async (userId, productId) => {
    validateProductId(productId);

    const cart = await Cart.findOne({ userId: Number(userId) });
    if (!cart) throw notFound("Cart is empty");

    const initialLength = cart.items.length;
    cart.items = cart.items.filter((item) => item.productId.toString() !== productId);

    if (cart.items.length === initialLength) {
        throw notFound("Product not found in cart");
    }

    await cart.save();
    return serializeCart(cart.toObject ? cart.toObject() : cart);
};

const clearCart = async (userId) => {
    const cart = await Cart.findOne({ userId: Number(userId) });
    if (cart) {
        cart.items = [];
        await cart.save();
    }
    return serializeCart(null);
};

export {
    getCart,
    addCartItem,
    updateCartItem,
    removeCartItem,
    clearCart
};
export default {
    getCart,
    addCartItem,
    updateCartItem,
    removeCartItem,
    clearCart
};

