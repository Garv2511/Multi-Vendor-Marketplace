import { Router } from "express";
import registerRouter from "./register.routes.js";
import vendorDataRouter from "./vendor-data.routes.js";
import adminRouter from "./admin.routes.js";
import authRouter from "./auth.routes.js";
import productRouter from "./product.routes.js";

const router = Router();

router.use("/auth", authRouter);
router.use("/register", registerRouter);
router.use("/vendor-data", vendorDataRouter);
router.use("/admin", adminRouter);
router.use("/products", productRouter);

export {
    authRouter,
    registerRouter,
    vendorDataRouter,
    adminRouter,
    productRouter
};

export default router;
