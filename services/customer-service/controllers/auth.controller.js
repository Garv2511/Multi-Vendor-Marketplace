import {
    requestOtp,
    resendOtp,
    verifyCustomerOtp,
    getCustomerMe
} from "../services/auth.service.js";

export const requestCustomerOtpController = async (req, res) => {
    try {
        const { email } = req.body;
        const result = await requestOtp(email);
        return res.status(200).json(result);
    } catch (error) {
        console.error("Error in requestCustomerOtpController:", error);
        return res.status(error.statusCode || 500).json({
            message: error.message || "Failed to request customer OTP"
        });
    }
};

export const verifyCustomerOtpController = async (req, res) => {
    try {
        const { email, otp, displayName } = req.body;
        const result = await verifyCustomerOtp(email, otp, displayName);
        return res.status(200).json(result);
    } catch (error) {
        console.error("Error in verifyCustomerOtpController:", error);
        return res.status(error.statusCode || 500).json({
            message: error.message || "Customer OTP verification failed"
        });
    }
};

export const resendOtpController = async (req, res) => {
    try {
        const { email } = req.body;
        const result = await resendOtp(email);
        return res.status(200).json(result);
    } catch (error) {
        console.error("Error in resendOtpController:", error);
        return res.status(error.statusCode || 500).json({
            message: error.message || "Failed to resend OTP"
        });
    }
};

export const getMeController = async (req, res) => {
    try {
        const me = await getCustomerMe(req.user.userId);
        return res.status(200).json({
            message: "Customer user profile retrieved successfully",
            data: me
        });
    } catch (error) {
        console.error("Error in getMeController:", error);
        return res.status(error.statusCode || 500).json({
            message: error.message || "Internal server error"
        });
    }
};

