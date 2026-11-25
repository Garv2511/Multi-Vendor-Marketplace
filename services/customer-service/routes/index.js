import { Router } from "express";
import authRouter from "./auth.routes.js";
import customerRouter from "./customer.routes.js";
import catalogRouter from "./catalog.routes.js";
import cartRouter from "./cart.routes.js";
import orderRouter from "./order.routes.js";

const router = Router();

router.use("/auth", authRouter);
router.use("/customers", customerRouter);
router.use("/catalog", catalogRouter);
router.use("/cart", cartRouter);
router.use("/orders", orderRouter);

export {
    authRouter,
    customerRouter,
    catalogRouter,
    cartRouter,
    orderRouter
};

export default router;

