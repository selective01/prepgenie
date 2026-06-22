require("dotenv").config();
const dns       = require("dns");
const express   = require("express");
const cors      = require("cors");
const connectDB = require("./src/config/db");

// Fix DNS resolution for MongoDB Atlas SRV on Windows
dns.setServers(["8.8.8.8", "8.8.4.4"]);

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  credentials: true,
}));

// Routes
app.use("/api/auth", require("./src/routes/auth"));
app.use("/api/quiz", require("./src/routes/quiz"));

// Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({ success: true, message: "PrepGenie API is running" });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 PrepGenie API running on port ${PORT} [${process.env.NODE_ENV}]`);
});
