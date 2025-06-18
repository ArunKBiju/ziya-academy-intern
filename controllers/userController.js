const User = require("../models/User");

const createUser = async (req, res) => {
  console.log("File received:", req.file);
  console.log("Body received:", req.body);

  const { name, email, username } = req.body;
  const photo = req.file?.filename;

  if (!name || !email || !username || !photo) {
    return res.status(400).json({ error: "All fields including photo are required" });
  }

  try {
    const user = await User.create({ name, email, username, photo });
    res.status(201).json({ message: "User created", user });
  } catch (err) {
    res.status(500).json({ error: "Server error: " + err.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json({ users });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateUser = async (req, res) => {
  const { name, email, username } = req.body;
  const update = { name, email, username };

  if (req.file) {
    update.photo = req.file.filename;
  }

  try {
    const user = await User.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ message: "User updated", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const result = await User.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ error: "User not found" });
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
};
