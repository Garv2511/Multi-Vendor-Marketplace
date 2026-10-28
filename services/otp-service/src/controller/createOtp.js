import crypto from "crypto";
import { hashOTP } from "../utils/hashOtp.js";
import sendMail from "../utils/sendMail.js";
import client from "../config/redis.js";

const createOTP = async (req, res) => {
    const email = typeof req.body?.email === "string" ? req.body.email.trim().toLowerCase() : "";
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ error: "A valid email is required" });
    }

    const expiryMinutes = Number(process.env.OTP_EXPIRY_TIME);
    const cooldownMs = Number(process.env.RESEND_COOLDOWN);
    if (!Number.isFinite(expiryMinutes) || expiryMinutes <= 0) {
        return res.status(500).json({ error: "OTP expiry configuration is invalid" });
    }

    const existing = await client.get(email);
    if (existing && cooldownMs > 0) {
        const existingData = JSON.parse(existing);
        if (Date.now() - Number(existingData.createdAt) < cooldownMs) {
            return res.status(429).json({ error: "Please wait before requesting another OTP" });
        }
    }

    const otp = crypto.randomInt(100000, 1000000);
    const otpData = {
        otp: hashOTP(otp),
        expiresAt: Date.now() + expiryMinutes * 60 * 1000,
        createdAt: Date.now(),
        attempts: 0,
        lastResentAt: Date.now(),
        totalResends: 0
    };

    try {
        await client.set(email, JSON.stringify(otpData), { EX: expiryMinutes * 60 });
        await sendMail(email, otp);
    } catch (err) {
        await client.del(email).catch(() => {});
        console.error("Error sending OTP email:", err);
        return res.status(500).json({ error: "Failed to send OTP email" });
    }

    return res.json({
        success: true,
        message: "OTP sent successfully"
    });
}

export default createOTP;