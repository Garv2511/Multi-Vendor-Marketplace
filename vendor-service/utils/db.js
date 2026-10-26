import mongoose from "mongoose";
import dotenv from "dotenv";
import crypto from "crypto";

dotenv.config();

const vendorSchema = new mongoose.Schema({
    userId: { type: Number, unique: true },
    storeName: String,
    slug: { type: String, unique: true },
    kycDocs: [String],
    status: String,
    commissionPct: Number,
    payoutAccountId: String,
    uuid: { type: String, unique: true, default: () => crypto.randomUUID(), sparse: true },
}, { timestamps: true });

mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/vendor-service")
    .then(() => console.log("database connection successful for vendor services"))
    .catch((err) => console.error("Database connection error:", err));

const Vendor = mongoose.model("Vendor", vendorSchema);
export default Vendor;