import jwt from "jsonwebtoken";
import { JWT_SECRET, JWT_VERIFY_OPTIONS } from "../utils/auth-config.js";

export const authenticate = (req, res, next) => {
    const authHeader = req.headers["authorization"] || req.headers["Authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            message: "Unauthorized: Missing or malformed authentication token"
        });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET, JWT_VERIFY_OPTIONS);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({
            message: "Unauthorized: Invalid or expired token",
            error: err.message
        });
    }
};

export const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !req.user.role) {
            return res.status(401).json({ message: "Unauthorized: No identity found" });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                message: `Forbidden: Access requires one of the following roles: [${roles.join(", ")}]`
            });
        }

        next();
    };
};

export const requireCustomer = [authenticate, authorizeRoles("customer")];
export const requireVendorOrAdmin = [authenticate, authorizeRoles("vendor", "admin")];

export default {
    authenticate,
    authorizeRoles,
    requireCustomer,
    requireVendorOrAdmin
};

