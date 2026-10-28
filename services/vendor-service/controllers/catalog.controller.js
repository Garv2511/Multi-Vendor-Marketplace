import {
    DEFAULT_PAGE_SIZE,
    MAX_PAGE_SIZE,
    getCatalogProducts,
    getCatalogProduct
} from "../services/catalog.service.js";

const parsePagination = (query) => {
    const page = query.page === undefined ? 1 : Number(query.page);
    const pageSize = query.pageSize === undefined ? DEFAULT_PAGE_SIZE : Number(query.pageSize);

    if (!Number.isInteger(page) || page < 1) {
        const error = new Error("page must be a positive integer");
        error.statusCode = 400;
        throw error;
    }
    if (!Number.isInteger(pageSize) || pageSize < 1 || pageSize > MAX_PAGE_SIZE) {
        const error = new Error(`pageSize must be an integer between 1 and ${MAX_PAGE_SIZE}`);
        error.statusCode = 400;
        throw error;
    }

    return { page, pageSize };
};

export const getCatalogProductsController = async (req, res) => {
    try {
        const { page, pageSize } = parsePagination(req.query);
        const search = typeof req.query.search === "string" ? req.query.search.trim() : "";

        if (search.length > 100) {
            return res.status(400).json({ message: "search must not exceed 100 characters" });
        }

        const result = await getCatalogProducts({ page, pageSize, search });
        return res.status(200).json({
            message: "Catalog products fetched successfully",
            data: result
        });
    } catch (error) {
        console.error("Error in getCatalogProductsController:", error);
        return res.status(error.statusCode || 500).json({
            message: error.message || "Internal server error while fetching catalog products"
        });
    }
};

export const getCatalogProductController = async (req, res) => {
    try {
        const product = await getCatalogProduct(req.params.productId);
        return res.status(200).json({
            message: "Catalog product fetched successfully",
            data: product
        });
    } catch (error) {
        console.error("Error in getCatalogProductController:", error);
        return res.status(error.statusCode || 500).json({
            message: error.message || "Internal server error while fetching catalog product"
        });
    }
};

export default {
    getCatalogProductsController,
    getCatalogProductController
};
