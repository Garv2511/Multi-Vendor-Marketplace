import mongoose from "mongoose";
import dotenv from "dotenv";
import crypto from "crypto";
import { hashPassword } from "./password.js";

dotenv.config();

const userSchema = new mongoose.Schema({
    userId: { type: Number, unique: true, required: true },
    email: { type: String, unique: true, required: true, lowercase: true, trim: true },
    password: { type: String, select: false },
    role: { type: String, enum: ["admin", "vendor"], default: "vendor" }
}, {
    timestamps: true,
    toJSON: {
        transform: (doc, ret) => {
            delete ret.password;
            return ret;
        }
    }
});

const vendorSchema = new mongoose.Schema({
    userId: { type: Number, unique: true },
    email: { type: String, sparse: true, lowercase: true, trim: true },
    password: { type: String, select: false },
    storeName: String,
    slug: { type: String, unique: true },
    kycDocs: [String],
    status: { type: String, default: "pending" },
    commissionPct: { type: Number, default: 0 },
    payoutAccountId: String,
    uuid: { type: String, unique: true, default: () => crypto.randomUUID(), sparse: true },
}, {
    timestamps: true,
    toJSON: {
        transform: (doc, ret) => {
            delete ret.password;
            return ret;
        }
    }
});

const productSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    stockQuantity: { type: Number, required: true, min: 0, validate: Number.isInteger },
    vendorId: { type: Number, required: true, index: true }
}, {
    timestamps: true
});

// Auto-hash password on save if modified and not already hashed
userSchema.pre("save", async function () {
    if (this.isModified("password") && this.password) {
        if (!this.password.startsWith("$2a$") && !this.password.startsWith("$2b$")) {
            this.password = await hashPassword(this.password);
        }
    }
});

vendorSchema.pre("save", async function () {
    if (this.isModified("password") && this.password) {
        if (!this.password.startsWith("$2a$") && !this.password.startsWith("$2b$")) {
            this.password = await hashPassword(this.password);
        }
    }
});

mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/vendor-service")
    .then(() => console.log("database connection successful for vendor services"))
    .catch((err) => console.error("Database connection error:", err));

const User = mongoose.model("User", userSchema);
const Vendor = mongoose.model("Vendor", vendorSchema);
const Product = mongoose.model("Product", productSchema);

export { User, Vendor, Product };
export default Vendor;