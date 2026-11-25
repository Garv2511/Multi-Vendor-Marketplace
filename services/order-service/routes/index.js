import { Router } from "express";
import customerOrderRouter from "./customer-order.routes.js";
import vendorOrderRouter from "./vendor-order.routes.js";

const router = Router();

// Customer order routes
router.use("/orders", customerOrderRouter);
router.use("/customer/orders", customerOrderRouter);

// Vendor order routes (accessible at /vendor/orders, /vendor-data/orders, and /orders/vendor)
router.use("/vendor/orders", vendorOrderRouter);
router.use("/vendor-data/orders", vendorOrderRouter);
router.use("/orders/vendor", vendorOrderRouter);

export { customerOrderRouter, vendorOrderRouter };
export default router;

