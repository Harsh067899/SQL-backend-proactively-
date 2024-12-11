// In src/controllers/userController.js
const { User } = require('../config/database');  // Correctly import from database.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { sendOTP, verifyUserOTP } = require('../utils/otpUtils');

const signup = async (req, res) => {
  const { first_name, last_name, email, password, role } = req.body;

  // Check if user exists
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) return res.status(400).json({ error: 'User already exists' });

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({ first_name, last_name, email, password: hashedPassword, role });

  // Send OTP for verification
  sendOTP(newUser.email);

  res.status(201).json({ message: 'User created, OTP sent for verification' });
};

const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;
  console.log("Received email:", email);  // Log to verify if email is being sent correctly
  
  if (!email || !otp) {
    return res.status(400).json({ error: 'Email and OTP are required' });
  }

  const isVerified = await verifyUserOTP(email, otp); 
  if (!isVerified) return res.status(400).json({ error: 'Invalid OTP' });

  // Update user verification status
  await User.update({ isVerified: true }, { where: { email } });
  res.status(200).json({ message: 'User verified successfully' });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ where: { email } });
  if (!user) return res.status(404).json({ error: 'User not found' });

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) return res.status(400).json({ error: 'Invalid password' });

  const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

  res.status(200).json({ token });
};

module.exports = { signup, verifyOTP, login };
