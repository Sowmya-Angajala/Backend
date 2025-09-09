const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const taskRoutes = require('./routes/task.routes');
const connectDB = require('./config/db');


dotenv.config();


const app = express();
app.use(express.json());


// Connect to MongoDB
connectDB();


// Routes
app.use('/tasks', taskRoutes);


// Global error handler (simple)
app.use((err, req, res, next) => {
console.error(err);
res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));