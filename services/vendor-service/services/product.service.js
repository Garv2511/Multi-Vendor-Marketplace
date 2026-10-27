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

export { createProduct };
export default { createProduct };
