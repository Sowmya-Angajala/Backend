const mongoose = require('mongoose');


const resetTokenSchema = new mongoose.Schema({
userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
token: { type: String, required: true, unique: true },
expiresAt: { type: Date, required: true },
used: { type: Boolean, default: false }
});


resetTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });


module.exports = mongoose.model('ResetToken', resetTokenSchema);