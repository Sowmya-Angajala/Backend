const express = require('express');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
dotenv.config();


const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const { forgotPasswordLimiter, loginLimiter } = require('./middleware/rateLimit');


const app = express();
connectDB();


app.use(helmet());
app.use(express.json());
app.use(cookieParser());


// Routes
app.use('/api/auth', authRoutes);



app.use((err, req, res, next) => {
console.error(err);
res.status(500).json({ message: 'Internal server error' });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));