import { Router } from "express";
import { vendorDataController } from "../controllers/vendor-data.controller.js";
import { authenticate, authorizeVendorOwnerOrAdmin } from "../middlewares/auth.js";

const router = Router();

// Protect vendor data: requires authentication, admin can view all, vendors can only view their own
router.get("/:userId", authenticate, authorizeVendorOwnerOrAdmin, vendorDataController);

export { router as vendorDataRouter };
export default router;
