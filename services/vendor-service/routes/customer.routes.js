import { Router } from "express";
import { getCustomerProfileController } from "../controllers/customer.controller.js";
import { requireCustomer } from "../middlewares/auth.js";

const router = Router();

router.get("/me", requireCustomer, getCustomerProfileController);

export { router as customerRouter };
export default router;
