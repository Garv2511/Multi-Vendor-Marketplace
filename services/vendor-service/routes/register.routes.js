import { Router } from "express";
import { registerController } from "../controllers/register.controller.js";
import { authenticate, authorizeRoles } from "../middlewares/auth.js";

const router = Router();

// Only authenticated vendors or admins can register vendor details
router.post("/", authenticate, authorizeRoles("vendor", "admin"), registerController);

export { router as registerRouter };
export default router;
