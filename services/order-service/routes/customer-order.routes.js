import { Router } from "express";
import {
    createOrderController,
    listCustomerOrdersController,
    getCustomerOrderController,
    cancelCustomerOrderController
} from "../controllers/customer-order.controller.js";
import { requireCustomer } from "../middlewares/auth.js";

const router = Router();

router.use(requireCustomer);
router.post("/", createOrderController);
router.get("/", listCustomerOrdersController);
router.get("/:orderId", getCustomerOrderController);
router.post("/:orderId/cancel", cancelCustomerOrderController);

export { router as customerOrderRouter };
export default router;

