const express = require("express");
const connectDB = require("./config/mongodbConfig");
const userRoutes = require("./routes/userRouter");

const app = express();
connectDB();

app.use(express.json());
app.use("/api", userRoutes);

const PORT = 5000;
app.listen(PORT, () => console.log(` Server running on port ${PORT}`));
