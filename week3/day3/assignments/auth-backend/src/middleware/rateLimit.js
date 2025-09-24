const rateLimit = require('express-rate-limit');


const forgotPasswordLimiter = rateLimit({
windowMs: 15 * 60 * 1000, // 15 minutes
max: 5,
message: 'Too many reset requests from this IP, please try later.'
});


const loginLimiter = rateLimit({
windowMs: 15*60*1000,
max: 10,
message: 'Too many login attempts, please try later.'
});


module.exports = { forgotPasswordLimiter, loginLimiter };