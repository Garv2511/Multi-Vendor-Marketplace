import mongoose from "mongoose";
import dotenv from "dotenv";
import crypto from "crypto";

dotenv.config();

const userSchema = new mongoose.Schema({
    userId: { type: Number, unique: true, required: true },
    email: { type: String, unique: true, required: true, lowercase: true, trim: true },
    role: { type: String, enum: ["admin", "vendor"], default: "vendor" }
}, { timestamps: true });

const vendorSchema = new mongoose.Schema({
    userId: { type: Number, unique: true },
    email: { type: String, sparse: true, lowercase: true, trim: true },
    storeName: String,
    slug: { type: String, unique: true },
    kycDocs: [String],
    status: { type: String, default: "pending" },
    commissionPct: { type: Number, default: 0 },
    payoutAccountId: String,
    uuid: { type: String, unique: true, default: () => crypto.randomUUID(), sparse: true },
}, { timestamps: true });

mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/vendor-service")
    .then(() => console.log("database connection successful for vendor services"))
    .catch((err) => console.error("Database connection error:", err));

const User = mongoose.model("User", userSchema);
const Vendor = mongoose.model("Vendor", vendorSchema);

export { User, Vendor };
export default Vendor;