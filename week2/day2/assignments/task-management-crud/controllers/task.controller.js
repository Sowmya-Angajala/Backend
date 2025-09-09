const Task = require('../models/task.model');


// Create a new task
async function createTask(req, res, next) {
try {
const { title, description, priority, dueDate } = req.body;


// Ensure title uniqueness (Mongoose unique index helps but we check explicitly)
const existing = await Task.findOne({ title: title.trim() });
if (existing) return res.status(409).json({ message: 'Task with this title already exists' });


const task = new Task({ title: title.trim(), description: description.trim(), priority, dueDate });
await task.save();
res.status(201).json({ message: 'Task created', task });
} catch (err) {
// handle duplicate key error fallback
if (err.code === 11000) return res.status(409).json({ message: 'Task with this title already exists' });
next(err);
}
}


// Get all tasks, optional filters: ?priority=low&status=completed|pending
async function getTasks(req, res, next) {
try {
const { priority, status } = req.query;
const filter = {};
if (priority) filter.priority = priority;
if (status) {
if (status === 'completed') filter.isCompleted = true;
else if (status === 'pending') filter.isCompleted = false;
// else ignore invalid status (could also return 400)
}


const tasks = await Task.find(filter).sort({ createdAt: -1 });
res.json({ tasks });
} catch (err) {
next(err);
}
}


// Update a task partially - only title, priority, description, isCompleted, dueDate allowed
async function updateTask(req, res, next) {
try {
const { id } = req.params;
const { title, priority, description, isCompleted, dueDate } = req.body;


const update = {};
if (title !== undefined) update.title = title.trim();
if (priority !== undefined) update.priority = priority;
}catch(e){
    console.log(e)
}

}
module.exports = { createTask, getTasks, updateTask, deleteTasks };