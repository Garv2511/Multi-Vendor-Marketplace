import {
    createProduct,
    getMyProducts,
    updateProduct,
    deleteProduct
} from "../services/product.service.js";

const editableProductFields = new Set([
    "title",
    "description",
    "price",
    "stockQuantity"
]);

const updateProductController = async (req, res) => {
    try {
        const body = req.body || {};
        const suppliedFields = Object.keys(body);
        const invalidFields = suppliedFields.filter((field) => !editableProductFields.has(field));

        if (invalidFields.length > 0) {
            return res.status(400).json({
                message: `Protected or unsupported product fields cannot be updated: ${invalidFields.join(", ")}`
            });
        }

        if (suppliedFields.length === 0) {
            return res.status(400).json({
                message: "At least one editable product field is required"
            });
        }

        const updateData = {};

        if (Object.prototype.hasOwnProperty.call(body, "title")) {
            if (typeof body.title !== "string" || !body.title.trim()) {
                return res.status(400).json({ message: "title must be a non-empty string" });
            }
            updateData.title = body.title.trim();
        }

        if (Object.prototype.hasOwnProperty.call(body, "description")) {
            if (typeof body.description !== "string" || !body.description.trim()) {
                return res.status(400).json({ message: "description must be a non-empty string" });
            }
            updateData.description = body.description.trim();
        }

        if (Object.prototype.hasOwnProperty.call(body, "price")) {
            if (typeof body.price !== "number" || !Number.isFinite(body.price) || body.price <= 0) {
                return res.status(400).json({ message: "price must be a positive number" });
            }
            updateData.price = body.price;
        }

        if (Object.prototype.hasOwnProperty.call(body, "stockQuantity")) {
            if (
                typeof body.stockQuantity !== "number" ||
                !Number.isInteger(body.stockQuantity) ||
                body.stockQuantity < 0
            ) {
                return res.status(400).json({
                    message: "stockQuantity must be a non-negative integer"
                });
            }
            updateData.stockQuantity = body.stockQuantity;
        }

        const userId = req.user?.userId;
        if (userId === undefined || userId === null) {
            return res.status(401).json({ message: "Authenticated user identity is required" });
        }

        const product = await updateProduct(req.params.productId, userId, updateData);

        return res.status(200).json({
            message: "Product updated successfully",
            data: product
        });
    } catch (error) {
        console.error("Error in updateProductController:", error);
        return res.status(error.statusCode || 500).json({
            message: error.message || "Internal server error while updating product"
        });
    }
};

const deleteProductController = async (req, res) => {
    try {
        const userId = req.user?.userId;
        if (userId === undefined || userId === null) {
            return res.status(401).json({ message: "Authenticated user identity is required" });
        }

        const product = await deleteProduct(req.params.productId, userId);

        return res.status(200).json({
            message: "Product deleted successfully",
            data: {
                productId: product._id
            }
        });
    } catch (error) {
        console.error("Error in deleteProductController:", error);
        return res.status(error.statusCode || 500).json({
            message: error.message || "Internal server error while deleting product"
        });
    }
};

const getMyProductsController = async (req, res) => {
    try {
        const userId = req.user?.userId;
        if (userId === undefined || userId === null) {
            return res.status(401).json({ message: "Authenticated user identity is required" });
        }

        const products = await getMyProducts(userId);

        return res.status(200).json({
            message: "Vendor products fetched successfully",
            data: products
        });
    } catch (error) {
        console.error("Error in getMyProductsController:", error);
        return res.status(error.statusCode || 500).json({
            message: error.message || "Internal server error while fetching products"
        });
    }
};

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

export {
    getMyProductsController,
    createProductController,
    updateProductController,
    deleteProductController
};
export default {
    getMyProductsController,
    createProductController,
    updateProductController,
    deleteProductController
};
