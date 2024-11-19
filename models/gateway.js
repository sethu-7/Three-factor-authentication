// File: models/Gateway.js
const mongoose = require('mongoose');

const gatewaySchema = new mongoose.Schema({
  masterKey: { type: String, required: true }, // x in the protocol
  primeY: { type: String, required: true },    // y in the protocol
  primeZ: { type: String, required: true },    // z in the protocol
  compositeN: { type: String, required: true } // n = y * z
});

module.exports = mongoose.model('Gateway', gatewaySchema);