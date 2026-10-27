import { Router } from "express";
import {
    vendorDataController,
    updateVendorController,
    uploadKycController
} from "../controllers/vendor-data.controller.js";
import { authenticate, authorizeVendorOwnerOrAdmin } from "../middlewares/auth.js";
import { uploadKyc } from "../middlewares/upload.js";

const router = Router();

// Current vendor profile shortcuts
router.get("/profile", authenticate, vendorDataController);
router.put("/profile", authenticate, updateVendorController);

// Upload KYC document(s) for the authenticated vendor
router.post("/upload-kyc", authenticate, uploadKyc.any(), uploadKycController);

// Target specific userId: requires authentication, admin can access all, vendors access their own
router.get("/:userId", authenticate, authorizeVendorOwnerOrAdmin, vendorDataController);
router.put("/:userId", authenticate, authorizeVendorOwnerOrAdmin, updateVendorController);

export { router as vendorDataRouter };
export default router;
