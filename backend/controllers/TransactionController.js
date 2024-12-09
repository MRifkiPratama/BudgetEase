const User = require('../models/User'); // Pastikan ada model User
const Transaction = require('../models/Transaction'); // Model Transaction

async function payment(req, res) {
    const { id } = req.params; // sender's user ID from the route
    const { amount, payment_type, destination } = req.body;

    try {
        if (amount <= 0) {
            return res.status(400).json({ error: "Amount must be greater than zero" });
        }

        const validPaymentTypes = ['Food', 'Health', 'Education', 'Entertainment', 'Lifestyle', 'General', 'Other', 'Transportation', 'Transfer'];
        if (!validPaymentTypes.includes(payment_type)) {
            return res.status(400).json({ error: "Invalid payment type" });
        }

        // Fetch sender from MongoDB
        const sender = await User.findById(id);
        if (!sender) {
            return res.status(404).json({ error: "Sender not found" });
        }

        // Fetch receiver by name or id
        const receiver = await User.findOne({ $or: [{ name: destination }, { _id: destination }] });
        if (!receiver) {
            return res.status(404).json({ error: "Receiver not found" });
        }

        // Check sender's balance
        if (sender.balance < amount) {
            return res.status(400).json({ error: "Insufficient balance" });
        }

        // Start transaction in MongoDB
        const session = await User.startSession();
        session.startTransaction();

        try {
            // Ensure amount is a valid number
            const transactionAmount = parseFloat(amount);
            if (isNaN(transactionAmount)) {
                return res.status(400).json({ error: "Invalid amount provided" });
            }

            // Update sender's balance and expense (ensure no repetition)
            sender.balance -= transactionAmount;  // Decrease balance by amount
            sender.expense += transactionAmount;  // Add amount to expenses
            await sender.save({ session });

            // Update receiver's balance and income (ensure no repetition)
            receiver.balance += transactionAmount;  // Increase balance by amount
            receiver.income += transactionAmount;   // Add amount to income
            await receiver.save({ session });

            // Record the transaction
            const transaction = new Transaction({
                user_sender_id: sender._id,
                user_receiver_id: receiver._id,
                amount: transactionAmount,
                transaction_type: payment_type,
            });
            await transaction.save({ session });

            // Commit transaction
            await session.commitTransaction();
            session.endSession();

            res.status(200).json({
                message: "Payment successful",
                transaction: { sender: sender.name, receiver: receiver.name, amount: transactionAmount, payment_type }
            });
        } catch (transactionError) {
            // Rollback transaction in case of error
            await session.abortTransaction();
            session.endSession();
            console.error('Error processing transaction:', transactionError);
            return res.status(500).json({ error: "An error occurred during the transaction process" });
        }

    } catch (error) {
        console.error('Error in payment:', error);
        res.status(500).json({ error: "An error occurred during the payment process" });
    }
}




async function history(req, res) {
    const { id } = req.params;

    try {
        // Fetch transactions for the given user ID
        const transactions = await Transaction.find({ user_sender_id: id })
            .populate('user_receiver_id', 'name') // Populate receiver's name
            .sort({ transaction_date: 1 }); // Sort by transaction date

        if (transactions.length === 0) {
            return res.status(404).json({ error: "No transactions found for this user" });
        }

        // Map results to include receiver's name and other details
        const result = transactions.map(tx => ({
            transaction_type: tx.transaction_type,
            amount: tx.amount,
            transaction_date: tx.transaction_date,
            receiver_name: tx.user_receiver_id.name,
        }));

        res.status(200).json({ transactions: result });
    } catch (error) {
        console.error('Error fetching transactions:', error);
        res.status(500).json({ error: "An error occurred while fetching transactions" });
    }
}

async function historyByType(req, res) {
    const { id } = req.params;
    const { transactionType } = req.query;

    try {
        const transactions = await Transaction.find({
            user_sender_id: id,
            transaction_type: transactionType,
        })
            .populate('user_receiver_id', 'name')
            .sort({ transaction_date: 1 });

        if (transactions.length === 0) {
            return res.status(404).json({ error: "No transactions found for this user with the specified type" });
        }

        const result = transactions.map(tx => ({
            transaction_type: tx.transaction_type,
            amount: tx.amount,
            transaction_date: tx.transaction_date,
            receiver_name: tx.user_receiver_id.name,
        }));

        res.status(200).json({ transactions: result });
    } catch (error) {
        console.error('Error fetching transactions by type:', error);
        res.status(500).json({ error: "An error occurred while fetching transactions by type" });
    }
}




module.exports = { payment, history, historyByType };