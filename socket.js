const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const app = express();
const port = 3000;

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*", // Allow any origin for CORS
  },
});

// Store the connected users and their socket IDs
let users = {};

// Handle new connections
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Register the user with their socket ID
  socket.on('registerUser', (userId) => {
    users[userId] = socket.id; // Store the user's socket ID
    console.log(`User ${userId} is registered with socket ID ${socket.id}`);
  });

socket.on('fetchMessages', async ({ userId1, userId2 }) => {
  try {
    const messageHistory = await Message.find({
      $or: [
        { sender: mongoose.Types.ObjectId(userId1), receiver: mongoose.Types.ObjectId(userId2) },
        { sender: mongoose.Types.ObjectId(userId2), receiver: mongoose.Types.ObjectId(userId1) }
      ],
    }).sort({ timestamp: 1 });

    socket.emit('messageHistory', messageHistory);
  } catch (err) {
    console.error('Error fetching messages:', err);
  }
});


  // Listen for 'sendMessage' events from clients
  socket.on('sendMessage', (message) => {
    const { senderId, receiverId, message: text } = message;

    // Emit the message to the receiver, if connected
    if (users[receiverId]) {
      io.to(users[receiverId]).emit('receiveMessage', message);
    }

    // Optionally, send the message back to the sender as well
    socket.emit('receiveMessage', message);
  });

  // Handle user disconnect
  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);

    // Remove the disconnected user from the users map
    for (const userId in users) {
      if (users[userId] === socket.id) {
        delete users[userId];
        console.log(`User ${userId} has been removed`);
        break;
      }
    }
  });
});

// Start the server
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
