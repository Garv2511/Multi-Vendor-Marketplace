import dotenv from "dotenv";

dotenv.config();

export const JWT_SECRET = process.env.JWT_SECRET || "default_jwt_secret_key_change_in_production";
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

export const JWT_SIGN_OPTIONS = {
    algorithm: "HS256",
    expiresIn: JWT_EXPIRES_IN
};

export const JWT_VERIFY_OPTIONS = {
    algorithms: ["HS256"]
};

