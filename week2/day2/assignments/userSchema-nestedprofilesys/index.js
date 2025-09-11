require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const errorHandler = require("./middleware/errorHandler");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// connect DB
connectDB(
  process.env.MONGO_URI || "mongodb://localhost:27017/nestedProfilesDB"
);

// routes
app.use("/api", userRoutes);

// health
app.get("/", (req, res) => res.send("API running"));

// centralized error handler (must come after routes)
app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
