const mongoose = require('mongoose');

const FinancialHealthSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID is required']
    },
    total_spending: {
        type: Number,
        required: [true, 'Total spending is required'],
        min: [0, 'Total spending cannot be negative']
    },
    total_income: {
        type: Number,
        required: [true, 'Total income is required'],
        min: [0, 'Total income cannot be negative']
    },
    score: {
        type: Number,
        min: [0, 'Score must be at least 0'],
        max: [100, 'Score cannot exceed 100']
    }
});

module.exports = mongoose.model('FinancialHealth', FinancialHealthSchema);
