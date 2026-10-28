import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "super_secret_vendor_service_jwt_key_2026";

/**
 * Middleware to verify JWT authentication token
 */
export const authenticate = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                message: "Authentication token required. Format: Bearer <token>"
            });
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, JWT_SECRET);

        req.user = decoded; // { userId, email, role, iat, exp }
        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Authentication token has expired" });
        }
        return res.status(401).json({ message: "Invalid authentication token" });
    }
};

/**
 * Role-Based Access Control (RBAC) middleware factory
 * @param  {...string} allowedRoles Roles permitted to access the endpoint ('admin', 'vendor')
 */
export const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !req.user.role) {
            return res.status(401).json({ message: "User is not authenticated" });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                message: `Forbidden: Access requires one of [${allowedRoles.join(", ")}]. Current role: '${req.user.role}'`
            });
        }

        next();
    };
};

/**
 * Ensures admins can access any vendor data, while vendors can only access their own data
 */
export const authorizeVendorOwnerOrAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: "User is not authenticated" });
    }

    if (req.user.role === "admin") {
        return next();
    }

    const requestedUserId = req.params?.userId || req.query?.userId;
    if (requestedUserId && Number(req.user.userId) !== Number(requestedUserId)) {
        return res.status(403).json({
            message: "Forbidden: You are only allowed to access your own vendor data"
        });
    }

    next();
};

export const requireAdmin = [authenticate, authorizeRoles("admin")];
export const requireVendor = [authenticate, authorizeRoles("vendor", "admin")];
export const requireCustomer = [authenticate, authorizeRoles("customer")];

export default {
    authenticate,
    authorizeRoles,
    authorizeVendorOwnerOrAdmin,
    requireAdmin,
    requireVendor,
    requireCustomer
};
