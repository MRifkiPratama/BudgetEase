const pool = require('../db');
const bcrypt = require('bcrypt');

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

        // Fetch sender and receiver
        const senderResult = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
        if (senderResult.rowCount === 0) {
            return res.status(404).json({ error: "Sender not found" });
        }
        const sender = senderResult.rows[0];

        const receiverResult = await pool.query('SELECT * FROM users WHERE name = $1 OR id = $2', [destination, destination]);
        if (receiverResult.rowCount === 0) {
            return res.status(404).json({ error: "Receiver not found" });
        }
        const receiver = receiverResult.rows[0];

        // Check sender's balance
        if (sender.balance < amount) {
            return res.status(400).json({ error: "Insufficient balance" });
        }

        // Perform the transaction
        await pool.query('BEGIN');
        await pool.query('UPDATE users SET balance = balance - $1 WHERE id = $2', [amount, sender.id]);
        await pool.query('UPDATE users SET balance = balance + $1 WHERE id = $2', [amount, receiver.id]);
        await pool.query(
            'INSERT INTO transactions (user_sender_id, user_receiver_id, amount, transaction_type) VALUES ($1, $2, $3, $4)',
            [sender.id, receiver.id, amount, payment_type]
        );
        await pool.query('COMMIT');

        res.status(200).json({ message: "Payment successful", transaction: { sender: sender.name, receiver: receiver.name, amount, payment_type } });

    } catch (error) {
        await pool.query('ROLLBACK');
        console.error('Error in payment:', error);
        res.status(500).json({ error: "An error occurred during the payment process" });
    }
}

async function history(req, res) {
    const { id } = req.params; // ID pengguna dari route

    try {
        // Ambil semua transaksi untuk pengguna dengan ID yang diberikan
        const result = await pool.query(
            `SELECT 
                t.transaction_type, 
                t.amount, 
                t.transaction_date, 
                u_receiver.name AS receiver_name 
             FROM 
                transactions t
             JOIN 
                users u_receiver ON t.user_receiver_id = u_receiver.id 
             WHERE 
                t.user_sender_id = $1 
             ORDER BY 
                t.transaction_date`,
            [id]
        );
        

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "No transactions found for this user" });
        }

        // Mengembalikan hasil transaksi yang dikelompokkan berdasarkan tipe
        res.status(200).json({ transactions: result.rows });
    } catch (error) {
        console.error('Error fetching transactions:', error);
        res.status(500).json({ error: "An error occurred while fetching transactions" });
    }
}
async function historyByType(req, res) {
    const { id } = req.params; // ID pengguna dari route
    const { transactionType } = req.query; // Mengambil transaction_type dari query parameter

    try {
        // Ambil semua transaksi untuk pengguna dengan ID yang diberikan dan tipe transaksi tertentu
        const result = await pool.query(
            `SELECT 
                t.transaction_type, 
                t.amount, 
                t.transaction_date, 
                u_receiver.name AS receiver_name 
             FROM 
                transactions t
             JOIN 
                users u_receiver ON t.user_receiver_id = u_receiver.id 
             WHERE 
                t.user_sender_id = $1 AND 
                t.transaction_type = $2 
             ORDER BY 
                t.transaction_date`,
            [id, transactionType] // Menggunakan id dan transactionType sebagai parameter
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "No transactions found for this user with the specified type" });
        }

        // Mengembalikan hasil transaksi yang dikelompokkan berdasarkan tipe
        res.status(200).json({ transactions: result.rows });
    } catch (error) {
        console.error('Error fetching transactions by type:', error);
        res.status(500).json({ error: "An error occurred while fetching transactions by type" });
    }
}





module.exports = { payment, history, historyByType };