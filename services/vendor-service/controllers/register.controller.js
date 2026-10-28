import { register } from "../services/register.service.js";

const registerController = async (req, res) => {
    try {
        const {
            userId: bodyUserId,
            storeName,
            slug,
            kycDocs,
            status,
            commissionPct,
            payoutAccountId,
            password
        } = req.body || {};
        const protectedVendorFields = ["status", "commissionPct", "payoutAccountId"];
        if (req.user?.role !== "admin") {
            const suppliedProtectedFields = protectedVendorFields.filter((field) => (
                Object.prototype.hasOwnProperty.call(req.body || {}, field)
            ));
            if (suppliedProtectedFields.length > 0) {
                return res.status(400).json({
                    message: `Only administrators may set: ${suppliedProtectedFields.join(", ")}`
                });
            }
        }

        // Use authenticated user's userId if not explicitly provided
        const authenticatedUserId = req.user?.userId;
        const userId = bodyUserId || authenticatedUserId;

        // Prevent vendors from impersonating or registering for another userId
        if (req.user && req.user.role !== "admin" && bodyUserId && Number(bodyUserId) !== Number(authenticatedUserId)) {
            return res.status(403).json({
                message: "Forbidden: You cannot register a vendor profile for another user"
            });
        }

        if (!userId || !storeName) {
            return res.status(400).json({
                message: "userId and storeName are required"
            });
        }

        const generatedSlug = slug || storeName.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

        const result = await register(
            userId,
            storeName,
            generatedSlug,
            kycDocs || [],
            req.user?.role === "admin" ? (status || "pending") : "pending",
            req.user?.role === "admin" ? (commissionPct ?? 0) : 0,
            req.user?.role === "admin" ? (payoutAccountId || "") : "",
            req.user?.email,
            password
        );

        return res.status(result.statusCode || 200).json(result);
    } catch (error) {
        console.error("Error in registerController:", error);

        if (error.code === 11000) {
            return res.status(409).json({
                message: "Vendor already exists with this userId or slug"
            });
        }

        return res.status(500).json({
            message: "Internal server error while registering vendor"
        });
    }
};

export { registerController };
export default registerController;
