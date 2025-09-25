function register(eventBus) {
  // userLoggedIn
  eventBus.on("userLoggedIn", (username) => {
    console.log(`> User ${username} logged in`);
  });
  eventBus.on("userLoggedIn", (username) => {
    console.log(`> Notification sent to ${username}`);
  });

  // messageReceived
  eventBus.on("messageReceived", (username, message) => {
    console.log(`> New message for ${username}: ${message}`);
  });

  // dataSynced
  eventBus.on("dataSynced", (username) => {
    console.log(`> Data sync complete for ${username}`);
  });
}

module.exports = { register };
