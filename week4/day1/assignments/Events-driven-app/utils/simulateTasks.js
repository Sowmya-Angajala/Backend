function simulateLogin(eventBus, username) {
  setTimeout(() => {
    eventBus.emit("userLoggedIn", username);
  }, 1000);
}

function simulateMessage(eventBus, username, message) {
  setTimeout(() => {
    eventBus.emit("messageReceived", username, message);
  }, 1000);
}

function simulateDataSync(eventBus, username) {
  console.log("> Syncing user data...");
  setTimeout(() => {
    eventBus.emit("dataSynced", username);
  }, 2000);
}

module.exports = { simulateLogin, simulateMessage, simulateDataSync };
