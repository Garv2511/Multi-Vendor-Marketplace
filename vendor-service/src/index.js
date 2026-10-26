import express from "express";
import dotenv from "dotenv";

dotenv.config();

import routes from "../routes/index.js";

const app = express();

app.use(express.json());

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