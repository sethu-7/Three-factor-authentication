// File: models/Session.js
const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  sensorId: { type: String, required: true },
  sessionKey: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true }
});

module.exports = mongoose.model('Session', sessionSchema);









