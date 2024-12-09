const mongoose = require('mongoose');


const TransactionSchema = new mongoose.Schema({
    user_sender_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Sender is required']
    },
    user_receiver_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Receiver is required']
    },
    amount: {
        type: Number,
        required: [true, 'Amount is required'],
        min: [0.01, 'Amount must be greater than 0']
    },
    transaction_date: {
        type: Date,
        default: Date.now
    },
    transaction_type: {
        type: String,
        enum: ['Food', 'Health', 'Education', 'Entertainment', 'Lifestyle', 'General', 'Other', 'Transportation', 'Transfer'],
        required: [true, 'Transaction type is required']
    }
});

module.exports = mongoose.model('Transaction', TransactionSchema);
