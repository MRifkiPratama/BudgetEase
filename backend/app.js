const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const userRoutes = require('./routes/UserRoute');
const transactionRoutes = require('./routes/TransactionRoute');
const reportRoutes = require('./routes/ReportRoute');
const mongoose = require('mongoose');
const donationRoutes = require('./routes/DonationRoute');

const dotenv = require('dotenv');
const app = express();
const PORT = 5000;

// CORS configuration
app.use(cors({
  origin: "https://budget-ease-frontened.vercel.app", // Update without trailing slash
  methods: ["POST", "GET", "PUT", "DELETE"], // Include the HTTP methods you want to allow
  allowedHeaders: ["Content-Type", "Authorization"], // Add any other headers you might need
  credentials: true,  // Allow credentials (cookies, authorization headers)
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB connection
mongoose.connect('mongodb+srv://muhammadrifkipratama:rpl@budgetease.l8x08.mongodb.net/BudgetEase');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', function(){
  console.log('Connected to MongoDB');
});

// Test route to check server connection
app.get('/', (req, res) => {
  res.send('Backend connected successfully');
});

// Routes
app.use('/users', userRoutes);
app.use('/transaction', transactionRoutes);
app.use('/report', reportRoutes);
app.use('/donation', donationRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
