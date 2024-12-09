
const mongoose = require('mongoose');

const DonationSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID is required']
    },
    donation_sum: {
        type: Number,
        required: [true, 'Donation amount is required'],
        min: [0.01, 'Donation amount must be greater than 0']
    },
    title_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Title',
        required: [true, 'Title ID is required']
    },
    description: {
        type: String
    },
    donation_date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Donation', DonationSchema);
