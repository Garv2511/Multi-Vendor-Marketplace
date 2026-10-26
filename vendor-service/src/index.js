import express from "express";
import registerController from "../controllers/register.controller.js";
import { vendorDataController } from "../controllers/vendor-data.controller.js";

const app = express();

app.use(express.json());

app.get("/health", (req, res) => {
    console.log("/health called " + res.statusCode);
    res.json({ message: "ok" });
});

// Vendor registration
app.post("/register", registerController);

// Vendor Data
app.get("/vendor-data", vendorDataController);

app.listen(3000, () => {
    console.log("Server started on port 3000");
});