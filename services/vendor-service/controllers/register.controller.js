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
            status || "pending",
            commissionPct ?? 0,
            payoutAccountId || "",
            req.user?.email,
            password
        );

        return res.status(result.statusCode || 200).json(result);
    } catch (error) {
        console.error("Error in registerController:", error);

        if (error.code === 11000) {
            return res.status(409).json({
                message: "Vendor already exists with this userId or slug",
                error: error.message
            });
        }

        return res.status(500).json({
            message: "Internal server error while registering vendor",
            error: error.message
        });
    }
};

export { registerController };
export default registerController;
