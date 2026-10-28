import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET || JWT_SECRET.length < 32) {
    throw new Error("JWT_SECRET must be configured with at least 32 characters");
}

const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";
const JWT_SIGN_OPTIONS = {
    expiresIn: JWT_EXPIRES_IN,
    algorithm: "HS256"
};
const JWT_VERIFY_OPTIONS = {
    algorithms: ["HS256"]
};

export { JWT_SECRET, JWT_SIGN_OPTIONS, JWT_VERIFY_OPTIONS };
