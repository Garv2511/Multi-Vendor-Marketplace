import { Router } from "express";
import {
    getCatalogProductsController,
    getCatalogProductController
} from "../controllers/catalog.controller.js";

const router = Router();

router.get("/products", getCatalogProductsController);
router.get("/products/:productId", getCatalogProductController);

export { router as catalogRouter };
export default router;
