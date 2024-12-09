const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({

    name: {
        type: String,
        required: [true, 'Name is required']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        match: [/^[^@]+@[^@]+\.[^@]+$/, 'Please enter a valid email address']
    },
    password: {
        type: String,
        required: [true, 'Password is required']
    },
    balance: {
        type: Number,
        default: 0.00
    },
    donation: {
        type: Number,
        default: 0.00
    },
    income: {
        type: Number,
        default: 0.00
    },
    expense: {
        type: Number,
        default: 0.00
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', UserSchema);
