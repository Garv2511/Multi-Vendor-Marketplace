import { Router } from "express";
import {
    getVendorOrdersController,
    updateVendorOrderStatusController
} from "../controllers/vendor-order.controller.js";
import { requireVendorOrAdmin } from "../middlewares/auth.js";

const router = Router();

router.use(requireVendorOrAdmin);
router.get("/", getVendorOrdersController);
router.patch("/:orderId/status", updateVendorOrderStatusController);

export { router as vendorOrderRouter };
export default router;

