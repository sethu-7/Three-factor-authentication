// File: controllers/GatewayController.js
const Gateway = require('../models/gateway');
const CryptoUtils = require('../utils/crypto');

class GatewayController {
  static async initialize() {
    try {
      const masterKey = CryptoUtils.generateRandomNonce();
      const primeY = CryptoUtils.generatePrime();
      const primeZ = CryptoUtils.generatePrime();
      const compositeN = (primeY * primeZ).toString(16);

      const gateway = new Gateway({
        masterKey,
        primeY,
        primeZ,
        compositeN
      });

      await gateway.save();
      return { success: true, message: 'Gateway initialized successfully' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

module.exports = GatewayController;
