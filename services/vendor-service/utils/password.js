import bcrypt from "bcryptjs";

const SALT_ROUNDS = 10;

/**
 * Hashes a plaintext password using bcryptjs
 * @param {string} password - The plaintext password
 * @returns {Promise<string>} The hashed password
 */
export const hashPassword = async (password) => {
    if (!password || typeof password !== "string") {
        throw new Error("Password must be a non-empty string");
    }
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    return bcrypt.hash(password, salt);
};

/**
 * Compares a plaintext password against a hashed password
 * @param {string} password - Plaintext password
 * @param {string} hashedPassword - Hashed password from DB
 * @returns {Promise<boolean>} True if matched, false otherwise
 */
export const comparePassword = async (password, hashedPassword) => {
    if (!password || !hashedPassword) {
        return false;
    }
    return bcrypt.compare(password, hashedPassword);
};

export default {
    hashPassword,
    comparePassword
};

