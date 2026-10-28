import { Router } from "express";
import {
    getMyProductsController,
    createProductController,
    updateProductController,
    deleteProductController
} from "../controllers/product.controller.js";
import { authenticate, authorizeRoles } from "../middlewares/auth.js";

const router = Router();

router.get("/my", authenticate, authorizeRoles("vendor"), getMyProductsController);
router.patch("/:productId", authenticate, authorizeRoles("vendor"), updateProductController);
router.delete("/:productId", authenticate, authorizeRoles("vendor"), deleteProductController);
router.post("/", authenticate, authorizeRoles("vendor"), createProductController);

export { router as productRouter };
export default router;
