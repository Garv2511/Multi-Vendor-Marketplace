import {
    getCatalogProducts,
    getCatalogProduct
} from "../services/catalog.service.js";
import { parsePagination } from "../utils/catalog.validation.js";

export const getCatalogProductsController = async (req, res) => {
    try {
        const { page = "1", pageSize, search = "" } = req.query;
        const pagination = parsePagination({ page, pageSize });

        if (typeof search === "string" && search.length > 100) {
            return res.status(400).json({ message: "search query exceeds maximum length of 100 characters" });
        }

        const result = await getCatalogProducts({
            ...pagination,
            search: typeof search === "string" ? search.trim() : ""
        });

        return res.status(200).json({
            message: "Catalog products retrieved successfully",
            data: result
        });
    } catch (error) {
        console.error("Error in getCatalogProductsController:", error);
        return res.status(error.statusCode || 500).json({
            message: error.message || "Failed to retrieve catalog products"
        });
    }
};

export const getCatalogProductController = async (req, res) => {
    try {
        const product = await getCatalogProduct(req.params.productId);
        return res.status(200).json({
            message: "Product details retrieved successfully",
            data: product
        });
    } catch (error) {
        console.error("Error in getCatalogProductController:", error);
        return res.status(error.statusCode || 500).json({
            message: error.message || "Failed to retrieve product details"
        });
    }
};

