import { createProduct } from "../services/product.service.js";

const createProductController = async (req, res) => {
    try {
        const { title, description, price, stockQuantity } = req.body || {};

        if (typeof title !== "string" || !title.trim()) {
            return res.status(400).json({ message: "title is required and must not be empty" });
        }

        if (typeof description !== "string" || !description.trim()) {
            return res.status(400).json({ message: "description is required and must not be empty" });
        }

        if (typeof price !== "number" || !Number.isFinite(price) || price <= 0) {
            return res.status(400).json({ message: "price must be a positive number" });
        }

        if (typeof stockQuantity !== "number" || !Number.isInteger(stockQuantity) || stockQuantity < 0) {
            return res.status(400).json({ message: "stockQuantity must be a non-negative integer" });
        }

        const product = await createProduct(req.user.userId, {
            title: title.trim(),
            description: description.trim(),
            price,
            stockQuantity
        });

        return res.status(201).json({
            message: "Product created successfully",
            data: product
        });
    } catch (error) {
        console.error("Error in createProductController:", error);
        return res.status(error.statusCode || 500).json({
            message: error.message || "Internal server error while creating product"
        });
    }
};

export { createProductController };
export default createProductController;
