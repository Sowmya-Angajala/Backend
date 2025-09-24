const app = require('./app');
const mongoose = require('mongoose');

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/dish-booking-system';

console.log('  Starting Dish Booking System...');
console.log(' Connecting to MongoDB...');

// MongoDB connection with better error handling
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB successfully!');
  
  const server = app.listen(PORT, () => {
    console.log(` Server running on port ${PORT}`);
    console.log(` Health check: http://localhost:${PORT}/health`);
    console.log(` API docs: http://localhost:${PORT}/`);
  });

  // Graceful shutdown
  process.on('SIGINT', () => {
    console.log('\n Shutting down gracefully...');
    server.close(() => {
      mongoose.connection.close();
      console.log('Server closed successfully');
      process.exit(0);
    });
  });

})
.catch((error) => {
  console.error(' MongoDB connection failed:', error.message);
  console.log(' Make sure MongoDB is running on your system');
  process.exit(1);
});