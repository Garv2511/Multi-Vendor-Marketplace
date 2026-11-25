import jwt from "jsonwebtoken";
import { User, Customer, Vendor } from "../utils/db.js";
import { JWT_SECRET, JWT_SIGN_OPTIONS } from "../utils/auth-config.js";

const OTP_SERVICE_URL = process.env.OTP_SERVICE_URL || "http://localhost:3000";

const isConfiguredAdmin = (email) => {
    if (!email) return false;
    const adminEmails = (process.env.ADMIN_EMAILS || "")
        .split(",")
        .map(e => e.trim().toLowerCase())
        .filter(Boolean);
    return adminEmails.includes(email.trim().toLowerCase());
};

const requestOtp = async (email) => {
    if (!email) {
        const error = new Error("Email is required");
        error.statusCode = 400;
        throw error;
    }

    try {
        const response = await fetch(`${OTP_SERVICE_URL}/otp/new`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: email.trim().toLowerCase() })
        });

        const data = await response.json();
        if (!response.ok) {
            const error = new Error(data.message || data.error || "Failed to generate OTP");
            error.statusCode = response.status;
            throw error;
        }

        return data;
    } catch (err) {
        if (err.statusCode) throw err;
        const error = new Error(`OTP microservice unavailable at ${OTP_SERVICE_URL}: ${err.message}`);
        error.statusCode = 503;
        throw error;
    }
};

const resendOtp = async (email) => {
    if (!email) {
        const error = new Error("Email is required");
        error.statusCode = 400;
        throw error;
    }

    try {
        const response = await fetch(`${OTP_SERVICE_URL}/otp/resend`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: email.trim().toLowerCase() })
        });

        const data = await response.json();
        if (!response.ok) {
            const error = new Error(data.message || data.error || "Failed to resend OTP");
            error.statusCode = response.status;
            throw error;
        }

        return data;
    } catch (err) {
        if (err.statusCode) throw err;
        const error = new Error(`OTP microservice unavailable at ${OTP_SERVICE_URL}: ${err.message}`);
        error.statusCode = 503;
        throw error;
    }
};

const verifyOtpWithService = async (email, otp) => {
    try {
        const response = await fetch(`${OTP_SERVICE_URL}/otp/verify`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: email.trim().toLowerCase(), otp })
        });

        const verifyData = await response.json();
        if (!response.ok) {
            const error = new Error(verifyData.message || verifyData.error || "Invalid OTP or session expired");
            error.statusCode = response.status;
            throw error;
        }
    } catch (err) {
        if (err.statusCode) throw err;
        const error = new Error(`OTP microservice error at ${OTP_SERVICE_URL}: ${err.message}`);
        error.statusCode = 503;
        throw error;
    }
};

const verifyCustomerOtp = async (email, otp, displayName) => {
    if (!email || !otp) {
        const error = new Error("Email and OTP are required");
        error.statusCode = 400;
        throw error;
    }

    await verifyOtpWithService(email, otp);

    const normalizedEmail = email.trim().toLowerCase();
    let user = await User.findOne({ email: normalizedEmail });
    const vendorProfile = await Vendor.findOne({ email: normalizedEmail }).select("userId");

    if ((user && user.role !== "customer") || vendorProfile || isConfiguredAdmin(normalizedEmail)) {
        const error = new Error("This email is already registered for a non-customer account");
        error.statusCode = 409;
        throw error;
    }

    if (!user) {
        const latestUser = await User.findOne().sort({ userId: -1 });
        const nextUserId = (latestUser && latestUser.userId) ? latestUser.userId + 1 : 1001;

        user = new User({
            userId: nextUserId,
            email: normalizedEmail,
            role: "customer"
        });
        await user.save();
    }

    let customer = await Customer.findOne({ userId: user.userId });
    if (!customer) {
        customer = await Customer.create({
            userId: user.userId,
            email: normalizedEmail,
            ...(displayName?.trim() ? { displayName: displayName.trim() } : {})
        });
    } else if (displayName?.trim()) {
        customer.displayName = displayName.trim();
        await customer.save();
    }

    const token = jwt.sign({
        userId: user.userId,
        email: user.email,
        role: "customer"
    }, JWT_SECRET, JWT_SIGN_OPTIONS);

    return {
        message: "Customer authentication successful",
        token,
        user: {
            userId: user.userId,
            email: user.email,
            role: "customer"
        },
        customer: customer.toJSON ? customer.toJSON() : customer
    };
};

const getCustomerMe = async (userId) => {
    const user = await User.findOne({ userId: Number(userId) });
    if (!user) {
        const error = new Error("User identity not found");
        error.statusCode = 404;
        throw error;
    }

    const customer = await Customer.findOne({ userId: Number(userId) });

    return {
        userId: user.userId,
        email: user.email,
        role: user.role,
        customer: customer || null
    };
};

export {
    requestOtp,
    resendOtp,
    verifyCustomerOtp,
    getCustomerMe
};
export default {
    requestOtp,
    resendOtp,
    verifyCustomerOtp,
    getCustomerMe
};

