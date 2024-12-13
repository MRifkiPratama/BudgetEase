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
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
mongoose.connect('mongodb+srv://muhammadrifkipratama:rpl@budgetease.l8x08.mongodb.net/BudgetEase');
app.use(cors(
  {
    origin: ["https://budget-ease-frontened.vercel.app/"],
    methods: ["POST", "GET"],
    credentials: true
  }
));
app.use(express.urlencoded({extended: true}))
app.use(bodyParser.json());

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', function(){
console.log('Connected to MongoDB Muhammad Rifki Pratama');
});

app.get('/', (req, res) => {
  res.send('Backend connect test');
});

app.use('/users', userRoutes);
app.use('/transaction', transactionRoutes);
app.use('/report', reportRoutes);
app.use('/donation', donationRoutes)


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
