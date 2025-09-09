const db = require("./db");
const Task = require("./models/Task");

// Example: create a task
async function createTask() {
  try {
    const task = new Task({
      title: "Learn Mongoose",
      description: "Understand schemas and models",
      status: "in-progress",
      dueDate: new Date("2025-09-20"),
    });

    const savedTask = await task.save();
    console.log("Task Saved:", savedTask);
  } catch (error) {
    console.error("Error saving task:", error);
  }
}

createTask();
