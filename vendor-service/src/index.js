import express from "express";
import routes from "../routes/index.js";

const app = express();

app.use(express.json());

app.get("/health", (req, res) => {
    console.log("/health called " + res.statusCode);
    res.json({ message: "ok" });
});

// Mount application routes
app.use(routes);

app.listen(3000, () => {
    console.log("Server started on port 3000");
});