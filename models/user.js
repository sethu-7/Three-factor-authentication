// File: models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  IDui: { type: String, required: true, unique: true },
  PIDui: { type: String, required: true },
  pui: { type: String, required: true },
  qui: { type: String, required: true },
  Yui: { type: String, required: true }
});

module.exports = mongoose.model('User', userSchema);
