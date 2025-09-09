const mongoose = require("mongoose");

// MongoDB connection URL (make sure MongoDB is running)
const mongoURL = "mongodb://127.0.0.1:27017/TaskDB"; 

// Connect to MongoDB
mongoose.connect(mongoURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Connection Events
const db = mongoose.connection;

db.on("connected", () => {
  console.log("Connected to MongoDB successfully");
});

db.on("error", (err) => {
  console.error(" MongoDB connection error:", err);
});

db.on("disconnected", () => {
  console.log("MongoDB disconnected");
});

module.exports = db;
