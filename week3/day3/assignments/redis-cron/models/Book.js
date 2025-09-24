// src/models/Book.js
const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Book title is required'],
        trim: true,
        maxlength: [200, 'Title cannot exceed 200 characters']
    },
    author: {
        type: String,
        required: [true, 'Book author is required'],
        trim: true,
        maxlength: [100, 'Author name cannot exceed 100 characters']
    },
    isbn: {
        type: String,
        unique: true,
        sparse: true,
        trim: true,
        validate: {
            validator: function(v) {
                return !v || /^[0-9]{10}$|^[0-9]{13}$/.test(v);
            },
            message: 'ISBN must be 10 or 13 digits'
        }
    },
    publicationYear: {
        type: Number,
        min: [1000, 'Publication year must be after 1000'],
        max: [new Date().getFullYear(), 'Publication year cannot be in the future']
    },
    genre: {
        type: [String],
        default: []
    },
    description: {
        type: String,
        maxlength: [1000, 'Description cannot exceed 1000 characters']
    },
    addedBy: {
        type: String,
        required: [true, 'User ID is required']
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    }
}, {
    timestamps: true,
    toJSON: {
        transform: function(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
            return ret;
        }
    }
});

// Compound index for efficient queries
bookSchema.index({ title: 1, author: 1 });
bookSchema.index({ addedBy: 1, createdAt: -1 });
bookSchema.index({ isbn: 1 }, { unique: true, sparse: true });

// Text search index
bookSchema.index({
    title: 'text',
    author: 'text',
    description: 'text'
});

// Static method for bulk insert
bookSchema.statics.bulkInsert = async function(books) {
    try {
        const result = await this.insertMany(books, { ordered: false });
        return { success: true, insertedCount: result.length, books: result };
    } catch (error) {
        if (error.code === 11000) {
            // Handle duplicate key errors
            const insertedIds = error.result?.insertedIds || [];
            const insertedCount = insertedIds.length;
            const errors = error.writeErrors || [];
            
            return {
                success: false,
                insertedCount,
                errorCount: errors.length,
                errors: errors.map(err => ({
                    book: err.op,
                    error: err.errmsg
                }))
            };
        }
        throw error;
    }
};

// Instance method
bookSchema.methods.getSummary = function() {
    return {
        id: this._id,
        title: this.title,
        author: this.author,
        publicationYear: this.publicationYear,
        genre: this.genre
    };
};

module.exports = mongoose.model('Book', bookSchema);