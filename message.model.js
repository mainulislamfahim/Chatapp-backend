const mongoose = require('mongoose');
const db = require('./db');

const { Schema } = mongoose;

const messageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  seen: { type: Boolean, default: false },  // Add 'seen' flag
});

const messageModel = db.model('Message', messageSchema);

module.exports = messageModel;
