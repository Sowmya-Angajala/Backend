const cron = require("node-cron");
const redisClient = require("../config/redis");
const Message = require("../models/Message");

function startBackupJob() {
  // Run every 5 minutes
  cron.schedule("*/5 * * * *", async () => {
    console.log("Running backup job...");

    try {
      let history = await redisClient.lRange("chatHistory", 0, -1);
      history = history.map(JSON.parse);

      if (history.length > 0) {
        await Message.insertMany(history);
        console.log(` Backed up ${history.length} messages`);
      }
    } catch (err) {
      console.error(" Backup error:", err.message);
    }
  });
}

module.exports = startBackupJob;
