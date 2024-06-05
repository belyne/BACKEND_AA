const User = require('../models/User');

const getAllUsers = async (req, res) => {
  const user = await User.find();
  res.json(user);
}

const createUser = async (req, res) => {
  const user = new User(req.body);
  await user.save();
  res.json(user);
}

module.exports = {
  getAllUsers,
  createUser
};