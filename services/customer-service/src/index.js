import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";

dotenv.config();

import routes from "../routes/index.js";

const app = express();

const configuredOrigin = process.env.CORS_ORIGIN;
const originSetting = !configuredOrigin || configuredOrigin === "*" || configuredOrigin === "true"
    ? true
    : (configuredOrigin.includes(",") ? configuredOrigin.split(",").map(o => o.trim()) : configuredOrigin);

const corsOptions = {
    origin: originSetting,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS", "HEAD"],
    credentials: true,
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

// Serve uploaded product images & KYC docs statically if accessed via customer-service
app.use("/uploads", express.static(path.resolve("../vendor-service/uploads")));

app.get("/health", (req, res) => {
    res.json({ message: "ok", service: "customer-service" });
});

// Mount customer application routes
app.use(routes);

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
    console.log(`Customer service started on port ${PORT}`);
});

export default app;

