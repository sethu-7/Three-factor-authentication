// File: controllers/UserController.js
const User = require('../models/user');
const Gateway = require('../models/gateway');
const CryptoUtils = require('../utils/crypto');

class UserController {
  static async register(IDui, PWui, BIOui) {
    try {
      const gateway = await Gateway.findOne();
      if (!gateway) throw new Error('Gateway not initialized');

      const Yui = CryptoUtils.generateRandomNonce();
      const nui = CryptoUtils.generateRandomNonce();
      const MUui = CryptoUtils.hash(`${IDui}${nui}`);
      const PIDui = CryptoUtils.generateRandomNonce();
      const Yui_calc = CryptoUtils.hash(`${MUui}${gateway.masterKey}`);
      console.log("hello")

      // Simulate biometric processing
      const oui = CryptoUtils.hash(BIOui);
      const pui = CryptoUtils.hash(`${MUui}${PIDui}${PWui}${IDui}${BIOui}`);
      const qui = CryptoUtils.hash(`${IDui}${PWui}${PIDui}${MUui}${oui}`);

      const user = new User({
        IDui,
        PIDui,
        pui,
        qui,
        Yui: Yui_calc
      });

      await user.save();
      return { success: true, smartCard: { Yui: Yui_calc, PIDui } };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

module.exports = UserController;
