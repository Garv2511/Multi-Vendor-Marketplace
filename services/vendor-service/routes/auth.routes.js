import { Router } from "express";
import {
    requestOtpController,
    resendOtpController,
    verifyOtpController,
    requestCustomerOtpController,
    verifyCustomerOtpController,
    loginWithPasswordController,
    setPasswordController,
    getMeController
} from "../controllers/auth.controller.js";
import { authenticate } from "../middlewares/auth.js";

const router = Router();

// Public auth endpoints
router.post("/request-otp", requestOtpController);
router.post("/verify-otp", verifyOtpController);
router.post("/customer/request-otp", requestCustomerOtpController);
router.post("/customer/verify-otp", verifyCustomerOtpController);
router.post("/resend-otp", resendOtpController);
router.post("/login", loginWithPasswordController);

// Authenticated current-user endpoints
router.post("/set-password", authenticate, setPasswordController);
router.get("/me", authenticate, getMeController);

export { router as authRouter };
export default router;
