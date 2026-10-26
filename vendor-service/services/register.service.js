import Vendor from "../utils/db.js";

const register = async (userId, storeName, slug, kycDocs, status, commissionPct, payoutAccountId) => {
    const vendor = new Vendor({
        userId,
        storeName,
        slug,
        kycDocs,
        status,
        commissionPct,
        payoutAccountId
    });
    await vendor.save();
    return {
        message: "Vendor created sucessfully",
        statusCode: 200
    }
}

export {
    register
}