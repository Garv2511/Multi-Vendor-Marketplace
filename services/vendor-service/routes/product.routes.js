import { Router } from "express";
import {
    getMyProductsController,
    createProductController
} from "../controllers/product.controller.js";
import { authenticate, authorizeRoles } from "../middlewares/auth.js";

const router = Router();

router.get("/my", authenticate, authorizeRoles("vendor"), getMyProductsController);
router.post("/", authenticate, authorizeRoles("vendor"), createProductController);

export { router as productRouter };
export default router;
