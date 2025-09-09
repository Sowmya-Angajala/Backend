require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");
const libraryRoutes = require("./routes/library.routes");


const app = express();
app.use(bodyParser.json());


// Connect DB
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/librarydb";
connectDB(MONGODB_URI);


// Routes
app.use("/library", libraryRoutes);


// Global error handler (fallback)
app.use((err, req, res, next) => {
console.error(err);
res.status(500).json({ message: "Internal Server Error", error: err.message });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));