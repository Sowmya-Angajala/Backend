const redisClient = require("./config/redis");
const Message = require("./models/Message");

let onlineUsers = new Map();

function socketHandler(io) {
  io.on("connection", async (socket) => {
    console.log("🔌 New connection:", socket.id);

    // Register user
    socket.on("register", async ({ username, isAdmin }) => {
      socket.username = username;
      socket.isAdmin = isAdmin || false;
      onlineUsers.set(socket.id, username);

      io.emit("onlineUsers", Array.from(onlineUsers.values()));

      // Send chat history from Redis
      let history = await redisClient.lRange("chatHistory", 0, -1);
      history = history.map(JSON.parse);
      socket.emit("chatHistory", history);
    });

    // Group chat message
    socket.on("chatMessage", async (msg) => {
      const chatMsg = {
        username: socket.username,
        message: msg,
        isAdmin: socket.isAdmin,
        timestamp: new Date()
      };

      // Save in Redis
      await redisClient.rPush("chatHistory", JSON.stringify(chatMsg));
      // Limit to last 50 messages
      await redisClient.lTrim("chatHistory", -50, -1);

      io.emit("chatMessage", chatMsg);
    });

    // Admin announcement
    socket.on("adminMessage", async (msg) => {
      if (!socket.isAdmin) return;

      const adminMsg = {
        username: "ADMIN",
        message: msg,
        isAdmin: true,
        timestamp: new Date()
      };

      await redisClient.rPush("chatHistory", JSON.stringify(adminMsg));
      io.emit("chatMessage", adminMsg);
    });

    // Handle rooms
    socket.on("joinRoom", (room) => {
      socket.join(room);
      socket.room = room;
      socket.emit("message", `Joined room: ${room}`);
    });

    // Disconnect
    socket.on("disconnect", () => {
      console.log(" User disconnected:", socket.id);
      onlineUsers.delete(socket.id);
      io.emit("onlineUsers", Array.from(onlineUsers.values()));
    });
  });
}

module.exports = socketHandler;
