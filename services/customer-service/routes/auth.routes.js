import { Router } from "express";
import {
    requestCustomerOtpController,
    verifyCustomerOtpController,
    resendOtpController,
    getMeController
} from "../controllers/auth.controller.js";
import { authenticate } from "../middlewares/auth.js";

const router = Router();

// Dedicated customer endpoints
router.post("/customer/request-otp", requestCustomerOtpController);
router.post("/customer/verify-otp", verifyCustomerOtpController);

// Standard auth aliases for customer service
router.post("/request-otp", requestCustomerOtpController);
router.post("/verify-otp", verifyCustomerOtpController);
router.post("/resend-otp", resendOtpController);

// Authenticated customer identity
router.get("/me", authenticate, getMeController);

export { router as authRouter };
export default router;

