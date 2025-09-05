const todoModel = require("../models/todoModel");

const getTodos = (req, res) => {
  const todos = todoModel.getAllTodos();
  res.json(todos);
};

const getTodo = (req, res) => {
  const id = parseInt(req.params.id);
  const todo = todoModel.getTodoById(id);
  if (!todo) return res.status(404).json({ message: "Todo not found" });
  res.json(todo);
};

const createTodo = (req, res) => {
  const { title, completed } = req.body;
  if (!title) return res.status(400).json({ message: "Title is required" });
  const newTodo = todoModel.addTodo({ title, completed: completed || false });
  res.status(201).json(newTodo);
};

const updateTodo = (req, res) => {
  const id = parseInt(req.params.id);
  const updated = todoModel.updateTodo(id, req.body);
  if (!updated) return res.status(404).json({ message: "Todo not found" });
  res.json(updated);
};

const deleteTodo = (req, res) => {
  const id = parseInt(req.params.id);
  const deleted = todoModel.deleteTodo(id);
  if (!deleted) return res.status(404).json({ message: "Todo not found" });
  res.json({ message: "Todo deleted successfully" });
};

const searchTodos = (req, res) => {
  const q = req.query.q;
  if (!q) return res.status(400).json({ message: "Query parameter 'q' is required" });
  const results = todoModel.searchTodos(q);
  res.json(results);
};

module.exports = {
  getTodos,
  getTodo,
  createTodo,
  updateTodo,
  deleteTodo,
  searchTodos
};
