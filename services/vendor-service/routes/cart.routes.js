import { Router } from "express";
import {
    getCartController,
    addCartItemController,
    updateCartItemController,
    removeCartItemController,
    clearCartController
} from "../controllers/cart.controller.js";
import { requireCustomer } from "../middlewares/auth.js";

const router = Router();

router.use(requireCustomer);
router.get("/", getCartController);
router.post("/items", addCartItemController);
router.patch("/items/:productId", updateCartItemController);
router.delete("/items/:productId", removeCartItemController);
router.delete("/", clearCartController);

export { router as cartRouter };
export default router;
