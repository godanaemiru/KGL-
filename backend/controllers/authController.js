const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { username, password, role, branch } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword, role, branch });
    await user.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });

  if (user && (await bcrypt.compare(password, user.password))) {
    const token = jwt.sign(
      { id: user._id, role: user.role, branch: user.branch },
      process.env.JWT_SECRET || 'your_secret_key',
      { expiresIn: '8h' }
    );
    res.json({ token, role: user.role, branch: user.branch });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
};

// Fetch all staff members (excluding their passwords for security)
exports.getAllUsers = async (req, res) => {
  try {
    // .select('-password') ensures we don't accidentally send hashed passwords to the frontend!
    const users = await User.find().select('-password').lean();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch staff directory" });
  }
};