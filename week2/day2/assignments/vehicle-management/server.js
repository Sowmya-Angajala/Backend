require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const vehicleRoutes = require('./routes/vehicleRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
app.use(express.json());

connectDB(process.env.MONGO_URI || 'mongodb://localhost:27017/vehicleTripDB');

app.use('/api/vehicles', vehicleRoutes);

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
