import { Router } from "express";
import registerRouter from "./register.routes.js";
import vendorDataRouter from "./vendor-data.routes.js";
import adminRouter from "./admin.routes.js";
import authRouter from "./auth.routes.js";
import productRouter from "./product.routes.js";
import customerRouter from "./customer.routes.js";
import catalogRouter from "./catalog.routes.js";
import cartRouter from "./cart.routes.js";
import orderRouter from "./order.routes.js";

const router = Router();

router.use("/auth", authRouter);
router.use("/register", registerRouter);
router.use("/vendor-data", vendorDataRouter);
router.use("/admin", adminRouter);
router.use("/products", productRouter);
router.use("/customers", customerRouter);
router.use("/catalog", catalogRouter);
router.use("/cart", cartRouter);
router.use("/orders", orderRouter);

export {
    authRouter,
    registerRouter,
    vendorDataRouter,
    adminRouter,
    productRouter,
    customerRouter,
    catalogRouter,
    cartRouter,
    orderRouter
};

export default router;
