const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');

const SECRET_KEY = process.env.SECRET_KEY;
const TOKEN_EXPIRATION = process.env.TOKEN_EXPIRATION;

exports.signup = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if the username already exists
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user with the hashed password
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();

    // Redirect to the login page
    res.redirect('/login');
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Signup failed. Please try again later.' });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find the user by username
    const user = await User.findOne({ username });

    // If user not found or password doesn't match, return invalid credentials error
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Create JWT token
    const token = jwt.sign({ id: user._id, username: user.username }, SECRET_KEY, { expiresIn: TOKEN_EXPIRATION });

    // Return token
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Login failed. Please try again later.' });
  }
};

exports.protected = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(403).json({ message: 'No token provided' });
  }

  jwt.verify(token, SECRET_KEY, async (err, decoded) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to authenticate token' });
    }

    try {
      // Fetch user data from the database based on the decoded token's _id field
      const user = await User.findById(decoded._id);

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Render the protected page with user data
      res.render('protected', { message: 'This is a protected route', user });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
};
