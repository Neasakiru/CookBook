require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const errorHandler = require("./middleware/errorHandler");
const recipeRoutes = require("./routes/recipes");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:3000" }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/recipes", recipeRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// 404
app.use((req, res) => {
  res.status(404).json({ message: "Endpoint nie istnieje" });
});

// Error handler
app.use(errorHandler);

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/recipe-app")
  .then(() => {
    console.log("✅ Połączono z MongoDB");
    app.listen(PORT, () => console.log(`🚀 Serwer działa na porcie ${PORT}`));
  })
  .catch((err) => {
    console.error("❌ Błąd połączenia z MongoDB:", err.message);
    process.exit(1);
  });
