const pool = require('../db');
const bcrypt = require('bcrypt');
const User = require('../models/User'); // Pastikan ada model User



const getTotalIncome = async (req, res) => {
    const { id } = req.params; // User ID

    try {
        // Find the user by ID in MongoDB
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const totalIncome = user.income;
        res.status(200).json({ message: "Total income retrieved", total_income: totalIncome });
    } catch (error) {
        console.error('Error fetching total income:', error);
        res.status(500).json({ error: "An error occurred while retrieving total income" });
    }
};



const getTotalExpenses = async (req, res) => {
    const { id } = req.params; // User ID

    try {
        // Find the user by ID in MongoDB
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const totalExpenses = user.expense;
        res.status(200).json({ message: "Total expenses retrieved", total_expenses: totalExpenses });
    } catch (error) {
        console.error('Error fetching total expenses:', error);
        res.status(500).json({ error: "An error occurred while retrieving total expenses" });
    }
};

const getFinanceHealthScore = async (req, res) => {
    const { id } = req.params; // User ID

    try {
        // Find the user by ID in MongoDB
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const { income, expense } = user;

        if (income === 0) {
            return res.status(400).json({ error: "Cannot calculate score with zero income" });
        }

        // Calculate financial health score
        let score = ((income - expense) / income) * 100;

        // Clamp the score to a range of 0% to 100%
        score = Math.min(100, Math.max(0, score));

        res.status(200).json({ message: "Financial health score calculated", score: score.toFixed(2) });
    } catch (error) {
        console.error('Error calculating financial health score:', error);
        res.status(500).json({ error: "An error occurred while calculating the score" });
    }
};



module.exports = { getTotalExpenses, getTotalIncome, getFinanceHealthScore };
