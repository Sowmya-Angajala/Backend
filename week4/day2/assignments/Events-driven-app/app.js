const EventEmitter = require("events");
const eventHandlers = require("./events/eventHandlers");
const { simulateLogin, simulateMessage, simulateDataSync } = require("./utils/simulateTasks");

// Create EventEmitter instance
const eventBus = new EventEmitter();

// Register event handlers
eventHandlers.register(eventBus);

// Simulate events in sequence
simulateLogin(eventBus, "John");

setTimeout(() => {
  simulateMessage(eventBus, "John", "Hello from Node.js!");
}, 2000);

setTimeout(() => {
  simulateDataSync(eventBus, "John");
}, 4000);
