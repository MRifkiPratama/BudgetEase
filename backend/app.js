// server/app.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const userRoutes = require('./routes/UserRoute');
const transactionRoutes = require('./routes/TransactionRoute');
const reportRoutes = require('./routes/ReportRoute');
const donationRoutes = require('./routes/DonationRoute');


const dotenv = require('dotenv');

const app = express();
const PORT = 5000;
app.use(cors());
app.use(express.urlencoded({extended: true}))
app.use(bodyParser.json());

app.use('/users', userRoutes);
app.use('/transaction', transactionRoutes);
app.use('/report', reportRoutes);
app.use('/donation', donationRoutes)


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
