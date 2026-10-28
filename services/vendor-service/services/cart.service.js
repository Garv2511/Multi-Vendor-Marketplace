import mongoose from "mongoose";
import { Cart, Product, Vendor } from "../utils/db.js";

const invalidProductIdError = () => {
    const error = new Error("Invalid product ID");
    error.statusCode = 400;
    return error;
};

const getApprovedProduct = async (productId) => {
    if (!mongoose.isValidObjectId(productId)) {
        throw invalidProductIdError();
    }

    const product = await Product.findById(productId).lean();
    if (!product) {
        const error = new Error("Product not found");
        error.statusCode = 404;
        throw error;
    }

    const vendor = await Vendor.findOne({
        userId: product.vendorId,
        status: "approved"
    }).select("userId storeName").lean();

    if (!vendor) {
        const error = new Error("Product is not currently available");
        error.statusCode = 404;
        throw error;
    }

    return { product, vendor };
};

const getOrCreateCart = async (userId) => Cart.findOneAndUpdate(
    { userId: Number(userId) },
    { $setOnInsert: { userId: Number(userId), items: [] } },
    { new: true, upsert: true, setDefaultsOnInsert: true }
);

const mutateCart = async (userId, mutation) => {
    const normalizedUserId = Number(userId);

    for (let attempt = 0; attempt < 5; attempt += 1) {
        const cart = await getOrCreateCart(normalizedUserId);
        const nextItems = mutation(cart.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity
        })));

        const result = await Cart.updateOne(
            { _id: cart._id, __v: cart.__v },
            { $set: { items: nextItems }, $inc: { __v: 1 } }
        );

        if (result.matchedCount === 1) {
            return Cart.findById(cart._id);
        }
    }

    const error = new Error("Cart changed concurrently; please retry");
    error.statusCode = 409;
    throw error;
};

const serializeCart = async (cart) => {
    const productIds = cart.items.map((item) => item.productId);
    const products = productIds.length
        ? await Product.find({ _id: { $in: productIds } }).lean()
        : [];
    const vendors = products.length
        ? await Vendor.find({
            userId: { $in: products.map((product) => product.vendorId) },
            status: "approved"
        }).select("userId storeName").lean()
        : [];

    const productsById = new Map(products.map((product) => [product._id.toString(), product]));
    const vendorsById = new Map(vendors.map((vendor) => [vendor.userId, vendor]));
    let total = 0;

    const items = cart.items.map((item) => {
        const productId = item.productId.toString();
        const product = productsById.get(productId);
        const vendor = product ? vendorsById.get(product.vendorId) : null;
        const available = Boolean(product && vendor && item.quantity <= product.stockQuantity);
        const itemTotal = available ? product.price * item.quantity : 0;

        if (available) total += itemTotal;

        return {
            productId,
            title: product?.title || null,
            description: product?.description || null,
            currentPrice: product?.price ?? null,
            quantity: item.quantity,
            currentStock: product?.stockQuantity ?? 0,
            storeName: vendor?.storeName || null,
            available,
            itemTotal
        };
    });

    return {
        cartId: cart._id,
        items,
        total,
        currency: "USD",
        updatedAt: cart.updatedAt
    };
};

const getCart = async (userId) => serializeCart(await getOrCreateCart(userId));

const addCartItem = async (userId, productId, quantity) => {
    const { product } = await getApprovedProduct(productId);
    if (product.stockQuantity < quantity) {
        const error = new Error(`Requested quantity exceeds available stock of ${product.stockQuantity}`);
        error.statusCode = 409;
        throw error;
    }

    const cart = await mutateCart(userId, (items) => {
        const existingItem = items.find((item) => item.productId.toString() === product._id.toString());
        const resultingQuantity = existingItem ? existingItem.quantity + quantity : quantity;

        if (resultingQuantity > product.stockQuantity) {
            const error = new Error(`Requested quantity exceeds available stock of ${product.stockQuantity}`);
            error.statusCode = 409;
            throw error;
        }

        if (existingItem) {
            existingItem.quantity = resultingQuantity;
        } else {
            items.push({ productId: product._id, quantity });
        }
        return items;
    });

    return serializeCart(cart);
};

const updateCartItem = async (userId, productId, quantity) => {
    const { product } = await getApprovedProduct(productId);
    if (product.stockQuantity < quantity) {
        const error = new Error(`Requested quantity exceeds available stock of ${product.stockQuantity}`);
        error.statusCode = 409;
        throw error;
    }

    const cart = await mutateCart(userId, (items) => {
        const item = items.find((entry) => entry.productId.toString() === product._id.toString());
        if (!item) {
            const error = new Error("Cart item not found");
            error.statusCode = 404;
            throw error;
        }
        item.quantity = quantity;
        return items;
    });

    return serializeCart(cart);
};

const removeCartItem = async (userId, productId) => {
    if (!mongoose.isValidObjectId(productId)) {
        throw invalidProductIdError();
    }

    const cart = await mutateCart(userId, (items) => {
        const nextItems = items.filter((item) => item.productId.toString() !== productId);
        if (nextItems.length === items.length) {
            const error = new Error("Cart item not found");
            error.statusCode = 404;
            throw error;
        }
        return nextItems;
    });

    return serializeCart(cart);
};

const clearCart = async (userId) => {
    const cart = await mutateCart(userId, () => []);
    return serializeCart(cart);
};

export {
    getCart,
    addCartItem,
    updateCartItem,
    removeCartItem,
    clearCart
};
export default { getCart, addCartItem, updateCartItem, removeCartItem, clearCart };
