const app = require('./app');
const db = require('./db');
const Message = require('./message.model'); 
const http = require('http');
const socketIo = require('socket.io');
const bodyParser = require('body-parser');
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello World');
});

// Create HTTP server
const server = http.createServer(app);

// Setup Socket.IO
const io = socketIo(server, {
  cors: {
    origin: "*", // Allow all origins (in production, you should limit this)
  }
});

// Listen for Socket.IO connections
io.on('connection', (socket) => {
  console.log('New client connected', socket.id);

  // Store user ID when they connect
  socket.on('registerUser', (userId) => {
    socket.userId = userId;
    console.log(`User ${userId} connected with socket ID: ${socket.id}`);
  });

 
 // Listen for chat messages
// Listen for chat messages
socket.on('sendMessage', async (data) => {
  console.log('Message received:', data);

  const { senderId, receiverId, message } = data;

  // Find the receiver's socket ID
  const receiverSocket = Array.from(io.sockets.sockets.values())
    .find(s => s.userId === receiverId);

  if (receiverSocket) {
    console.log(`Sending message to ${receiverId}`);
    receiverSocket.emit('receiveMessage', {
      senderId,
      receiverId,
      message
    });
  } else {
    console.log('User ${receiverId} not found or not connected.');
  }
});


  // Listen for seen/unseen messages
  socket.on('messageSeen', (messageId) => {
    // Handle message seen logic here
    console.log(`Message ${messageId} seen by user ${socket.userId}`);
  });

 // Handle fetchMessages event
 socket.on('fetchMessages', async ({ userId1, userId2 }) => {
  try {
    const messageHistory = await Message.find({
      $or: [
        { sender: userId1, receiver: userId2 },
        { sender: userId2, receiver: userId1 },
      ],
    }).sort({ timestamp: 1 });

    // Send message history to the client
    socket.emit('messageHistory', messageHistory);
  } catch (err) {
    console.error('Error fetching messages:', err);
  }
});

  // Listen for disconnect event
  socket.on('disconnect', () => {
    console.log('Client disconnected', socket.id);
  });
});

// Bind server to all network interfaces
server.listen(port, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${port}`);
});

