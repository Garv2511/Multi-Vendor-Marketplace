import { Product, Vendor } from "../utils/db.js";

const createProduct = async (userId, productData) => {
    const vendor = await Vendor.findOne({ userId: Number(userId) });

    if (!vendor) {
        const error = new Error("Vendor profile not found");
        error.statusCode = 404;
        throw error;
    }

    if (vendor.status !== "approved") {
        const error = new Error("Only approved vendors can create products");
        error.statusCode = 403;
        throw error;
    }

    const product = await Product.create({
        title: productData.title,
        description: productData.description,
        price: productData.price,
        stockQuantity: productData.stockQuantity,
        vendorId: vendor.userId
    });

    return product;
};

const getMyProducts = async (userId) => {
    const vendor = await Vendor.findOne({ userId: Number(userId) })
        .select("userId email storeName")
        .lean();

    if (!vendor) {
        const error = new Error("Vendor profile not found");
        error.statusCode = 404;
        throw error;
    }

    const products = await Product.find({ vendorId: vendor.userId })
        .sort({ createdAt: -1, _id: -1 })
        .lean();

    return products.map((product) => ({
        productId: product._id,
        title: product.title,
        description: product.description,
        price: product.price,
        stockQuantity: product.stockQuantity,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
        vendorId: product.vendorId,
        vendorEmail: vendor.email,
        storeName: vendor.storeName
    }));
};

export { createProduct, getMyProducts };
export default { createProduct, getMyProducts };
