const mongoose = require('mongoose');
const db = require('./db');

const { Schema } = mongoose;

const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

const userModel = db.model('User', userSchema);

module.exports = userModel;
