require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");

const app = express();
app.use(express.json());

// Connect DB
connectDB(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/oneToOneDB");

// Routes
app.use("/api", userRoutes);

// Health check
app.get("/", (req, res) => {
  res.send("One-to-One Relationship API is running 🚀");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(` Server running on port ${PORT}`));
