const express = require('express');
const mongoose = require('mongoose');
const bookRoutes = require('./routes/bookRoutes');
const memberRoutes = require('./routes/memberRoutes');

const app = express();
app.use(express.json());

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/libraryDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Routes
app.use('/api/books', bookRoutes);
app.use('/api/members', memberRoutes);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
