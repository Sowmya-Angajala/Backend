require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const bookRoutes = require('./routes/bookRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
app.use(express.json());

// connect DB
connectDB(process.env.MONGO_URI || 'mongodb://localhost:27017/bookRentalDB');

// routes
app.use('/api', userRoutes);
app.use('/api', bookRoutes);

// 404
app.use((req, res) => res.status(404).json({ message: 'Route not found' }));

// error handler
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
