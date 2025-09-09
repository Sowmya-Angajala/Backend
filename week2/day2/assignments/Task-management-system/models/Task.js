const mongoose = require("mongoose");
const Task = require("./models/Task");
// Define Task Schema
const TaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,   // Title must be provided
  },
  description: {
    type: String,
  },
  status: {
    type: String,
    default: "pending", // Default status
  },
  dueDate: {
    type: Date,
  },
});

// Create Model
const Task = mongoose.model("Task", TaskSchema);


async function createTask(title, description, status, dueDate) {
  try {
    const task = new Task({ title, description, status, dueDate });
    const savedTask = await task.save();
    console.log("Task Created:", savedTask);
  } catch (error) {
    console.error("Error creating task:", error);
  }
}

async function getAllTasks() {
  try {
    const tasks = await Task.find();
    console.log("All Tasks:", tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
  }
}


async function getTasksByFilter(filter) {
  try {
    const tasks = await Task.find(filter); // e.g., { status: "pending" }
    console.log("Filtered Tasks:", tasks);
  } catch (error) {
    console.error("Error filtering tasks:", error);
  }
}


async function updateTask(id, updates) {
  try {
    const updatedTask = await Task.findByIdAndUpdate(id, updates, {
      new: true, // return updated document
    });
    console.log("Updated Task:", updatedTask);
  } catch (error) {
    console.error("Error updating task:", error);
  }
}


async function deleteTask(id) {
  try {
    const deletedTask = await Task.findByIdAndDelete(id);
    console.log("Deleted Task:", deletedTask);
  } catch (error) {
    console.error("Error deleting task:", error);
  }
}


module.exports = Task;
