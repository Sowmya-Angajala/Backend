require('dotenv').config(); 
const express = require('express');
const mongoose = require('mongoose');
const app = express();
require('dotenv').config();

// Middleware
app.use(express.json());

// Routes
const mentorRoutes = require('./routes/mentorRoutes');
const learnerRoutes = require('./routes/learnerRoutes');
const sessionRoutes = require('./routes/sessionRoutes');

app.use('/mentors', mentorRoutes);
app.use('/learners', learnerRoutes);
app.use('/sessions', sessionRoutes);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
