import { Router } from "express";
import { adminController } from "../controllers/admin.controller.js";
import { authenticate, authorizeRoles } from "../middlewares/auth.js";

const router = Router();

// Require admin authentication for all admin operations
router.use(authenticate, authorizeRoles("admin"));

router.get("/pending", adminController);
router.post("/approve", adminController);
router.post("/reject", adminController);

export { router as adminRouter };
export default router;
