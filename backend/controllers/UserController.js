// server/controllers/UserController.js
const pool = require('../db');
const bcrypt = require('bcrypt');
const User = require('../models/User'); // Model MongoDB


async function login(req, res) {
  const { email, password } = req.body;

  try {
    // Cari pengguna berdasarkan email di MongoDB
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: "Incorrect email or password provided" });
    }

    // Verifikasi password yang dimasukkan dengan yang ada di database
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Incorrect password provided" });
    }

    // Jika login berhasil, kembalikan data pengguna
    res.status(200).json({
      message: "Login Successful",
      account: {
        id: user._id,
        name: user.name,
        email: user.email,
        balance: user.balance,
        donation: user.donation,
        income: user.income,
        expense: user.expense,
      },
    });
  } catch (error) {
    console.error('Error in login:', error);
    res.status(500).json({ error: "An error occurred" });
  }
}


async function register(req, res) {
  const { name, email, password } = req.body; // Ambil data dari request body

  try {
    // Validasi jika email sudah terdaftar
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email is already in use" });
    }

    // Hash password sebelum disimpan
    const hashedPassword = await bcrypt.hash(password, 10);

    // Buat user baru
    const newUser = new User({
      name,
      email,
      password: hashedPassword,  // Simpan password yang sudah di-hash
    });

    // Simpan user ke database
    await newUser.save();

    // Kirim response jika berhasil
    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: "An error occurred" });
  }
}

async function getUserDetails(req, res) {
  const { id } = req.params; // Mengambil ID dari parameter URL

  try {
    // Cari pengguna berdasarkan ID di MongoDB
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Jika pengguna ditemukan, kembalikan detail pengguna
    res.status(200).json({
      message: "User details retrieved successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        balance: user.balance,
        donation: user.donation,
        income: user.income,
        expense: user.expense,
      },
    });
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).json({ error: "An error occurred" });
  }
}


async function topUp(req, res) {
  const { id } = req.params; // Mengambil ID dari parameter URL
  const { amount, donate } = req.body; // Jumlah top-up dan apakah menyetujui donasi

  // Validasi jumlah top-up
  if (typeof amount !== 'number' || amount <= 0) {
    return res.status(400).json({ error: "Invalid amount. It must be a positive number." });
  }

  let donationAmount = 0;

  // Hitung jumlah donasi jika menyetujui
  if (donate) {
    donationAmount = amount * 0.02; // 2% dari jumlah top-up
  }

  try {
    // Perbarui saldo pengguna di MongoDB
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Perbarui saldo pengguna, donasi, dan pendapatan
    user.balance += (amount - donationAmount);
    user.donation += donationAmount;
    user.expense += donationAmount;
    user.income += amount;

    // Simpan perubahan ke MongoDB
    await user.save();

    res.status(200).json({
      message: "User balance updated successfully",
      balance: user.balance,
      donation: user.donation,
    });
  } catch (error) {
    console.error('Error updating user balance:', error);
    res.status(500).json({ error: "An error occurred" });
  }
}



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