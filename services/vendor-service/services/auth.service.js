import jwt from "jsonwebtoken";
import { User, Vendor } from "../utils/db.js";
import { hashPassword, comparePassword } from "../utils/password.js";

const OTP_SERVICE_URL = process.env.OTP_SERVICE_URL || "http://localhost:3000";
const JWT_SECRET = process.env.JWT_SECRET || "super_secret_vendor_service_jwt_key_2026";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

/**
 * Checks if the given email is configured as an admin in ADMIN_EMAILS environment variable
 */
const isConfiguredAdmin = (email) => {
    if (!email) return false;
    const adminEmails = (process.env.ADMIN_EMAILS || "")
        .split(",")
        .map(e => e.trim().toLowerCase())
        .filter(Boolean);
    return adminEmails.includes(email.trim().toLowerCase());
};

/**
 * Requests an OTP from the OTP microservice
 */
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
            body: JSON.stringify({ email })
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

/**
 * Resends an OTP via the OTP microservice
 */
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
            body: JSON.stringify({ email })
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

/**
 * Verifies the OTP with the OTP microservice and logs in / registers the user with role-based JWT
 */
const verifyOtpAndLogin = async (email, otp) => {
    if (!email || !otp) {
        const error = new Error("Email and OTP are required");
        error.statusCode = 400;
        throw error;
    }

    // 1. Verify OTP with the OTP service
    try {
        const response = await fetch(`${OTP_SERVICE_URL}/otp/verify`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, otp })
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

    // 2. Resolve Role & User Profile in Vendor Service
    const normalizedEmail = email.trim().toLowerCase();
    const isAdmin = isConfiguredAdmin(normalizedEmail);

    let user = await User.findOne({ email: normalizedEmail });

    if (!user) {
        // Generate a new sequential/unique numeric userId
        const latestUser = await User.findOne().sort({ userId: -1 });
        const nextUserId = (latestUser && latestUser.userId) ? latestUser.userId + 1 : 1001;

        user = new User({
            userId: nextUserId,
            email: normalizedEmail,
            role: isAdmin ? "admin" : "vendor"
        });
        await user.save();
    } else if (isAdmin && user.role !== "admin") {
        // Upgrade to admin if email was designated as admin
        user.role = "admin";
        await user.save();
    }

    // 3. Check if vendor profile already exists for this user
    const vendorProfile = await Vendor.findOne({ userId: user.userId });

    // 4. Issue Role-Based JWT
    const payload = {
        userId: user.userId,
        email: user.email,
        role: user.role
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    return {
        message: "Authentication successful",
        token,
        user: {
            userId: user.userId,
            email: user.email,
            role: user.role
        },
        vendor: vendorProfile ? {
            storeName: vendorProfile.storeName,
            slug: vendorProfile.slug,
            status: vendorProfile.status,
            uuid: vendorProfile.uuid
        } : null
    };
};

/**
 * Authenticates user using email and password
 */
const loginWithPassword = async (email, password) => {
    if (!email || !password) {
        const error = new Error("Email and password are required");
        error.statusCode = 400;
        throw error;
    }

    const normalizedEmail = email.trim().toLowerCase();
    let user = await User.findOne({ email: normalizedEmail }).select("+password");

    // If user record doesn't exist, check Vendor record
    let vendorProfile = await Vendor.findOne({
        $or: [{ email: normalizedEmail }, ...(user ? [{ userId: user.userId }] : [])]
    }).select("+password");

    let passwordHash = user?.password || vendorProfile?.password;

    if (!user && !vendorProfile) {
        const error = new Error("Invalid email or password");
        error.statusCode = 401;
        throw error;
    }

    if (!passwordHash) {
        const error = new Error("No password set for this account. Please authenticate with OTP or set a password.");
        error.statusCode = 400;
        throw error;
    }

    const isMatch = await comparePassword(password, passwordHash);
    if (!isMatch) {
        const error = new Error("Invalid email or password");
        error.statusCode = 401;
        throw error;
    }

    // If user didn't exist in User table but existed in Vendor table, create User record
    if (!user && vendorProfile) {
        const isAdmin = isConfiguredAdmin(normalizedEmail);
        user = new User({
            userId: vendorProfile.userId,
            email: normalizedEmail,
            role: isAdmin ? "admin" : "vendor",
            password: passwordHash
        });
        await user.save();
    }

    // Role-based JWT
    const payload = {
        userId: user.userId,
        email: user.email,
        role: user.role
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    return {
        message: "Login successful",
        token,
        user: {
            userId: user.userId,
            email: user.email,
            role: user.role
        },
        vendor: vendorProfile ? {
            storeName: vendorProfile.storeName,
            slug: vendorProfile.slug,
            status: vendorProfile.status,
            uuid: vendorProfile.uuid
        } : null
    };
};

/**
 * Sets or updates a hashed password for a user and vendor
 */
const setPassword = async (userId, password) => {
    if (!userId) {
        const error = new Error("userId is required");
        error.statusCode = 400;
        throw error;
    }
    if (!password || typeof password !== "string" || password.length < 6) {
        const error = new Error("Password must be at least 6 characters long");
        error.statusCode = 400;
        throw error;
    }

    const hashedPassword = await hashPassword(password);

    const userUpdate = await User.updateOne(
        { userId: Number(userId) },
        { $set: { password: hashedPassword } }
    );
    const vendorUpdate = await Vendor.updateOne(
        { userId: Number(userId) },
        { $set: { password: hashedPassword } }
    );

    if (userUpdate.matchedCount === 0 && vendorUpdate.matchedCount === 0) {
        const error = new Error("User or vendor not found");
        error.statusCode = 404;
        throw error;
    }

    return {
        message: "Password set successfully after hashing",
        statusCode: 200
    };
};

export {
    requestOtp,
    resendOtp,
    verifyOtpAndLogin,
    loginWithPassword,
    setPassword
};
