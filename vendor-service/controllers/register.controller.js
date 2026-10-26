import { register } from "../services/register.service.js";

const registerController = async (req, res) => {
    try {
        const {
            userId,
            storeName,
            slug,
            kycDocs,
            status,
            commissionPct,
            payoutAccountId
        } = req.body || {};

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
            payoutAccountId || ""
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
