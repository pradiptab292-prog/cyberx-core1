const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
res.json({
app: "CyberX Family Safety",
status: "Backend running"
});
});

app.get("/health", (req, res) => {
res.json({ status: "ok" });
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, "0.0.0.0", () => {
console.log("Server listening on port ${PORT}");
});
