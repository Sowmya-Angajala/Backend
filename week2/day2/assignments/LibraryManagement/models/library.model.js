const mongoose = require("mongoose");


const LibrarySchema = new mongoose.Schema({
// Book fields (also used for user/borrowing info in same collection)
title: { type: String },
author: { type: String },
status: { type: String, default: "available" }, // intentionally not enum
borrowerName: { type: String, default: null },
borrowDate: { type: Date, default: null },
dueDate: { type: Date, default: null },
returnDate: { type: Date, default: null },
overdueFees: { type: Number, default: 0 },
}, { timestamps: true });


module.exports = mongoose.model("Library", LibrarySchema);