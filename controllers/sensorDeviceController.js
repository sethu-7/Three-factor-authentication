// File: controllers/SensorDeviceController.js
const SensorDevice = require('../models/sensorDevice');
const Gateway = require('../models/gateway');
const CryptoUtils = require('../utils/crypto');

class SensorDeviceController {
  static async register(IDsj) {
    try {
      const gateway = await Gateway.findOne();
      if (!gateway) throw new Error('Gateway not initialized');

      const Ysj = CryptoUtils.generateRandomNonce();
      // const SID=`${IDsj}${gateway.masterKey}`
      // console.log(SID)
      const SIDsj = CryptoUtils.hash(`${IDsj}${gateway.masterKey}`);
      const Ksj = CryptoUtils.hash(`${SIDsj}${Ysj}`);

      const sensorDevice = new SensorDevice({
        IDsj,
        Ysj,
        SIDsj,
        Ksj
      });

      await sensorDevice.save();
      return { success: true, SIDsj };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

module.exports = SensorDeviceController;