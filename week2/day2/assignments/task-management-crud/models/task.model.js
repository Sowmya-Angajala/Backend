const mongoose = require('mongoose');


const taskSchema = new mongoose.Schema({
title: { type: String, required: true, unique: true, trim: true },
description: { type: String, required: true, trim: true },
priority: { type: String, required: true, enum: ['low', 'medium', 'high'] },
isCompleted: { type: Boolean, default: false },
completionDate: { type: Date },
dueDate: { type: Date }
}, { timestamps: true });


const Task = mongoose.model('Task', taskSchema);
module.exports = Task;