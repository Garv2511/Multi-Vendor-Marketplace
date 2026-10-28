import { getCustomerProfile } from "../services/customer.service.js";

export const getCustomerProfileController = async (req, res) => {
    try {
        const profile = await getCustomerProfile(req.user.userId);
        return res.status(200).json({
            message: "Customer profile fetched successfully",
            data: profile
        });
    } catch (error) {
        console.error("Error in getCustomerProfileController:", error);
        return res.status(error.statusCode || 500).json({
            message: error.message || "Internal server error while fetching customer profile"
        });
    }
};

export default { getCustomerProfileController };
