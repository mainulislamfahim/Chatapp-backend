const express = require('express');
const router = express.Router();
const MessageModel = require('./message.model');
const UserModel = require('./user.model');

// Create a new user
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const user = new UserModel({ username, email, password });
    await user.save();
    res.status(201).json({
      status: true,
      message: 'Registered Successfully',
      data: user
    });
  } catch (error) {
    res.status(400).json({
      status: false,
      message: 'Error creating user',
      data: error
    });
  }
});

// Get all users
router.get('/', async (req, res) => {
  try {
    const users = await UserModel.find();
    res.status(200).json({ data: users });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching users', details: error });
  }
});

// Sign-in user
router.post('/signin', async (req, res) => {
  const { email, password } = req.body;
  try {
    // Find user by email and password
    const user = await UserModel.findOne({ email, password });
    if (user) {
      res.status(200).json({
        status: true,
        message: 'Signed In Successfully',
        data: user
      });
    } else {
      res.status(401).json({
        status: false,
        message: 'Invalid email or password',
        data: 'error',
      });
    } 
  } catch (error) {
    res.status(500).json({
      status: false,
      message: 'Error during sign-in',
      data: error
    });
  }
});


// Save chat message
router.post('/chat', async (req, res) => {
  const { sender, receiver, message } = req.body;
  try {
    const chatMessage = new MessageModel({ sender, receiver, message });
    await chatMessage.save();
    res.status(201).json({
      status: true,
      message: 'Message saved successfully',
      data: chatMessage
    });
  } catch (error) {
    res.status(400).json({
      status: false,
      message: 'Error saving message',
      data: error
    });
  }
});



module.exports = router;
