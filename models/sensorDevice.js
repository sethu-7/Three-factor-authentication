// File: models/SensorDevice.js
const mongoose = require('mongoose');

const sensorDeviceSchema = new mongoose.Schema({
  IDsj: { type: String, required: true, unique: true },
  Ysj: { type: String, required: true },
  SIDsj: { type: String, required: true },
  Ksj: { type: String, required: true }
});

module.exports = mongoose.model('SensorDevice', sensorDeviceSchema);
