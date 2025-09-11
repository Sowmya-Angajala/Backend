const mongoose = require('mongoose');


module.exports = async function connectDB() {
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/taskdb';
try {
await mongoose.connect(MONGO_URI, {
// mongoose 7 no longer requires these options but adding for clarity
});
console.log('MongoDB connected');
} catch (err) {
console.error('MongoDB connection error:', err.message);
process.exit(1);
}
};