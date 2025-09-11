module.exports = (err, req, res, next) => {
console.error(err);
const status = err.status || 500;


// Mongoose validation errors
if (err.name === 'ValidationError') {
const errors = Object.values(err.errors).map((e) => e.message);
return res.status(400).json({ message: 'Validation Error', errors });
}


// Duplicate key
if (err.code === 11000) {
return res.status(400).json({ message: 'Duplicate key error', detail: err.keyValue });
}


// CastError (bad ObjectId)
if (err.name === 'CastError') {
return res.status(400).json({ message: `Invalid ${err.path}: ${err.value}` });
}


res.status(status).json({ message: err.message || 'Internal Server Error' });
};