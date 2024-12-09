const pool = require('../db');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const User = require('../models/User'); // Pastikan ada model User


const getUserDonation = async (req, res) => {
    const { id } = req.params; // User ID

    try {
        // Fetch the user document from MongoDB by ID
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const donation = user.donation; // Get the donation value

        res.status(200).json({
            message: "User donation retrieved successfully",
            donation: donation
        });
    } catch (error) {
        console.error('Error fetching donation:', error);
        res.status(500).json({ error: "An error occurred while retrieving donation" });
    }
};



const addDonation = async (req, res) => {
    const { id } = req.params; // Extract user ID from the request parameters
    const { amount } = req.body; // Extract the amount to be donated

    // Validate amount
    if (typeof amount !== 'number' || amount <= 0) {
        return res.status(400).json({ error: "Invalid amount. It must be a positive number." });
    }

    try {
        // Find the user by ID
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Ensure the user has enough balance to make the donation
        if (user.balance < amount) {
            return res.status(400).json({ error: "Insufficient balance for donation" });
        }

        // Start a session for atomic operations (if needed for transactional behavior)
        const session = await mongoose.startSession();
        session.startTransaction();

        // Update the user's balance and donation fields atomically
        user.balance -= amount; // Subtract donation amount from balance
        user.donation += amount; // Add donation amount to donation field

        // Save the updated user document
        const updatedUser = await user.save({ session });

        // Commit the transaction
        await session.commitTransaction();
        session.endSession();

        res.status(200).json({
            message: "Donation successful. Balance and donation updated.",
            balance: updatedUser.balance,
            donation: updatedUser.donation
        });
    } catch (error) {
        // In case of error, rollback the transaction
        console.error('Error making donation:', error);
        res.status(500).json({ error: "An error occurred while making the donation" });
    }
};




module.exports = { getUserDonation, addDonation };

