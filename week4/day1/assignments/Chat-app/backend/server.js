require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const connectDB = require("./config/db");
const socketHandler = require("./socketHandler");
const startBackupJob = require("./utils/backupCron");

// Setup
const app = express();
app.use(cors());
app.use(express.json());

// DB connections
connectDB();
startBackupJob();

// HTTP + Socket.IO
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

socketHandler(io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

const path = require("path");
app.use(express.static(path.join(__dirname, "../frontend")));
