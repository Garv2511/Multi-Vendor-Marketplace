import { Customer } from "../utils/db.js";

const getCustomerProfile = async (userId) => {
    const customer = await Customer.findOne({ userId: Number(userId) }).lean();

    if (!customer) {
        const error = new Error("Customer profile not found");
        error.statusCode = 404;
        throw error;
    }

    return {
        customerId: customer._id,
        userId: customer.userId,
        email: customer.email,
        displayName: customer.displayName || null,
        createdAt: customer.createdAt,
        updatedAt: customer.updatedAt
    };
};

export { getCustomerProfile };
export default { getCustomerProfile };
