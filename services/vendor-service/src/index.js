import express from "express";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

import routes from "../routes/index.js";

const app = express();

// Enable CORS for all origins and headers
app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.get("/health", (req, res) => {
    console.log("/health called " + res.statusCode);
    res.json({ message: "ok", service: "vendor-service" });
});

// Mount application routes
app.use(routes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Vendor service started on port ${PORT}`);
});