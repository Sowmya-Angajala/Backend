const validPriorities = ['low', 'medium', 'high'];


function validateCreateTask(req, res, next) {
const { title, description, priority } = req.body;


if (!title || !description || !priority) {
return res.status(400).json({ message: 'Incomplete Data Received' });
}


if (typeof priority !== 'string' || !validPriorities.includes(priority)) {
return res.status(400).json({ message: "Priority must be one of 'low', 'medium', or 'high' (lowercase)" });
}


// Ensure title and description are non-empty strings
if (typeof title !== 'string' || title.trim() === '' || typeof description !== 'string' || description.trim() === '') {
return res.status(400).json({ message: 'Incomplete Data Received' });
}


next();
}


function validateUpdateTask(req, res, next) {
const { title, description, priority, isCompleted } = req.body;


if (priority !== undefined) {
if (typeof priority !== 'string' || !validPriorities.includes(priority)) {
return res.status(400).json({ message: "Priority must be one of 'low', 'medium', or 'high' (lowercase)" });
}
}


if (title !== undefined) {
if (typeof title !== 'string' || title.trim() === '') return res.status(400).json({ message: 'Title cannot be empty' });
}


if (description !== undefined) {
if (typeof description !== 'string' || description.trim() === '') return res.status(400).json({ message: 'Description cannot be empty' });
}


// If isCompleted present ensure it's boolean
if (isCompleted !== undefined) {
if (typeof isCompleted !== 'boolean') return res.status(400).json({ message: 'isCompleted must be boolean' });
}


next();
}


module.exports = { validateCreateTask, validateUpdateTask };