import { Vendor, User } from "../utils/db.js";
import { hashPassword } from "../utils/password.js";

const register = async (userId, storeName, slug, kycDocs, status, commissionPct, payoutAccountId, email, password) => {
    let hashedPassword = undefined;
    if (password) {
        hashedPassword = await hashPassword(password);
    }

    const vendor = new Vendor({
        userId,
        email,
        storeName,
        slug,
        kycDocs,
        status,
        commissionPct,
        payoutAccountId,
        ...(hashedPassword && { password: hashedPassword })
    });
    await vendor.save();

    // Synchronize hashed password to User account if one exists
    if (hashedPassword) {
        await User.updateOne(
            { $or: [{ userId }, { email: email?.toLowerCase().trim() }] },
            { $set: { password: hashedPassword } }
        );
    }

    const vendorData = vendor.toObject ? vendor.toObject() : { ...vendor._doc };
    delete vendorData.password;

    return {
        message: "Vendor created sucessfully",
        statusCode: 200,
        data: vendorData
    };
};

export {
    register
};