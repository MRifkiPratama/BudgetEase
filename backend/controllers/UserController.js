// server/controllers/UserController.js
const pool = require('../db');
const bcrypt = require('bcrypt');

async function login(req, res) {
  const { email, password } = req.body;

  try {
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (result.rowCount === 0) {
      return res.status(401).json({ error: "Incorrect email or password provided" });
    }

    var user = result.rows[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Incorrect password provided" });
    }
    res.status(200).json({ message: "Login Successful", account: user});
  } catch (error) {
    console.error('Error in login:', error);
    res.status(500).json({ error: "An error occurred" });
  }
}

async function register(req, res) {
  const { name, email, password } = req.body;

  try {
    // Check if the email is already in use
    const emailCheck = await pool.query(
      'SELECT COUNT(*) FROM users WHERE email = $1',
      [email]
    );

    if (emailCheck.rows[0].count > 0) {
      return res.status(400).json({ error: "Email is already in use" });
    }
    // Check if there are any users in the database
    const userCount = await pool.query('SELECT COUNT(*) FROM users');
    const isFirstUser = userCount.rows[0].count === 0;
    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, 10);
    // Insert the new user into the database
    const result = await pool.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *',
      [name, email, hashedPassword]
    );

    const newUser = result.rows[0];

    res.status(201).json(newUser);
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: "An error occurred" });
  }
}

async function getUserDetails(req, res) {
    const { id } = req.params; // Extracting user ID from the request parameters
  
    try {
      const result = await pool.query(
        'SELECT name, email, balance FROM users WHERE id = $1',
        [id] // Use the extracted ID in the query
      );
  
      if (result.rowCount === 0) {
        return res.status(404).json({ error: "User not found" });
      }
  
      const user = result.rows[0];
      res.status(200).json({ message: "User details retrieved", user });
    } catch (error) {
      console.error('Error fetching user details:', error);
      res.status(500).json({ error: "An error occurred" });
    }
  }


  async function topUp(req, res) {
    const { id } = req.params; // Extract user ID from the request parameters
    const { amount, donate } = req.body; // Extract the amount and donation agreement from the request body

    // Validate amount
    if (typeof amount !== 'number' || amount <= 0) {
        return res.status(400).json({ error: "Invalid amount. It must be a positive number." });
    }

    let donationAmount = 0;

    // Calculate donation if user agrees
    if (donate) {
        donationAmount = amount * 0.02; // 2% of the top-up amount
    }

    try {
        // Update the user's balance and donation
        const result = await pool.query(
            `UPDATE users 
            SET balance = balance + $1, 
                donation = donation + $2,
                income = income + $1
            WHERE id = $3 
            RETURNING balance, donation`,
            [amount, donationAmount, id] // Use the amount, donation amount, and user ID in the query
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        const updatedBalance = result.rows[0].balance;
        const updatedDonation = result.rows[0].donation;

        res.status(200).json({
            message: "User balance updated successfully",
            balance: updatedBalance,
            donation: updatedDonation
        });
    } catch (error) {
        console.error('Error updating user balance:', error);
        res.status(500).json({ error: "An error occurred" });
    }
}


//   async function topUp(req, res) {
//     const { id } = req.params; // Extract user ID from the request parameters
//     const { amount } = req.body; // Extract the amount to top up from the request body

//     // Validate amount
//     if (typeof amount !== 'number' || amount <= 0) {
//         return res.status(400).json({ error: "Invalid amount. It must be a positive number." });
//     }

//     try {
//         // Update the user's balance
//         const result = await pool.query(
//             'UPDATE users SET balance = balance + $1 WHERE id = $2 RETURNING balance',
//             [amount, id] // Use the amount and user ID in the query
//         );

//         if (result.rowCount === 0) {
//             return res.status(404).json({ error: "User not found" });
//         }

//         const updatedBalance = result.rows[0].balance;
//         res.status(200).json({ message: "User balance updated successfully", balance: updatedBalance });
//     } catch (error) {
//         console.error('Error updating user balance:', error);
//         res.status(500).json({ error: "An error occurred" });
//     }
// }
  

async function logout(req, res) {
  try {
    // Clear the session or remove the authentication token
    // This will effectively log the user out
    req.session.destroy(); // Assuming you're using session-based authentication
    // or
    // res.clearCookie('authToken'); // Assuming you're using token-based authentication

    res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Error in logout:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
}

module.exports = { login, register, logout, getUserDetails, topUp };