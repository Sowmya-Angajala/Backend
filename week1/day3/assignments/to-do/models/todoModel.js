const fs = require("fs");
const path = require("path");

const dbPath = path.join(__dirname, "../db.json");

const readData = () => {
  const data = fs.readFileSync(dbPath, "utf-8");
  return JSON.parse(data);
};

const writeData = (data) => {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), "utf-8");
};

const getAllTodos = () => {
  const data = readData();
  return data.todos;
};

const getTodoById = (id) => {
  const todos = getAllTodos();
  return todos.find(todo => todo.id === id);
};

const addTodo = (todo) => {
  const data = readData();
  const newId = data.todos.length ? data.todos[data.todos.length - 1].id + 1 : 1;
  const newTodo = { id: newId, ...todo };
  data.todos.push(newTodo);
  writeData(data);
  return newTodo;
};

const updateTodo = (id, updates) => {
  const data = readData();
  const index = data.todos.findIndex(todo => todo.id === id);
  if (index === -1) return null;
  data.todos[index] = { ...data.todos[index], ...updates };
  writeData(data);
  return data.todos[index];
};

const deleteTodo = (id) => {
  const data = readData();
  const index = data.todos.findIndex(todo => todo.id === id);
  if (index === -1) return false;
  data.todos.splice(index, 1);
  writeData(data);
  return true;
};

const searchTodos = (query) => {
  const todos = getAllTodos();
  const q = query.toLowerCase();
  return todos.filter(todo => todo.title.toLowerCase().includes(q));
};

module.exports = {
  getAllTodos,
  getTodoById,
  addTodo,
  updateTodo,
  deleteTodo,
  searchTodos
};
