const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/chatapp', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;

db.on('open', () => {
  console.log('Connection secure');
});

db.on('error', (err) => {
  console.error('Connection error:', err);
});

module.exports = db;
