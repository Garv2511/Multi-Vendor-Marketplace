import { requestOtp, resendOtp, verifyOtpAndLogin } from "../services/auth.service.js";
import { Vendor } from "../utils/db.js";

export const requestOtpController = async (req, res) => {
    try {
        const { email } = req.body || {};
        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        const result = await requestOtp(email);
        return res.status(200).json(result);
    } catch (error) {
        console.error("Error in requestOtpController:", error);
        return res.status(error.statusCode || 500).json({
            message: error.message || "Failed to request OTP"
        });
    }
};

export const resendOtpController = async (req, res) => {
    try {
        const { email } = req.body || {};
        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        const result = await resendOtp(email);
        return res.status(200).json(result);
    } catch (error) {
        console.error("Error in resendOtpController:", error);
        return res.status(error.statusCode || 500).json({
            message: error.message || "Failed to resend OTP"
        });
    }
};

export const verifyOtpController = async (req, res) => {
    try {
        const { email, otp } = req.body || {};
        if (!email || !otp) {
            return res.status(400).json({ message: "Both email and otp are required" });
        }

        const result = await verifyOtpAndLogin(email, otp);
        return res.status(200).json(result);
    } catch (error) {
        console.error("Error in verifyOtpController:", error);
        return res.status(error.statusCode || 500).json({
            message: error.message || "Failed to verify OTP"
        });
    }
};

export const getMeController = async (req, res) => {
    try {
        const vendor = await Vendor.findOne({ userId: req.user.userId });
        return res.status(200).json({
            message: "User profile fetched successfully",
            user: req.user,
            vendor: vendor || null
        });
    } catch (error) {
        console.error("Error in getMeController:", error);
        return res.status(500).json({
            message: "Internal server error fetching profile",
            error: error.message
        });
    }
};

export default {
    requestOtpController,
    resendOtpController,
    verifyOtpController,
    getMeController
};
