import { Router } from "express";
import {
    createOrderController,
    listOrdersController,
    getOrderController,
    cancelOrderController
} from "../controllers/order.controller.js";
import { requireCustomer } from "../middlewares/auth.js";

const router = Router();

router.use(requireCustomer);
router.post("/", createOrderController);
router.get("/", listOrdersController);
router.get("/:orderId", getOrderController);
router.post("/:orderId/cancel", cancelOrderController);

export { router as orderRouter };
export default router;
