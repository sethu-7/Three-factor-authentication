// File: controllers/AuthController.js
const User = require('../models/user');
const SensorDevice = require('../models/sensorDevice');
const Gateway = require('../models/gateway');
const Session = require('../models/session');
const CryptoUtils = require('../utils/crypto');

class AuthController {
  static async initiateKeyAgreement(IDui, PWui, BIOui, SIDsj) {
    // console.log(IDui)
    // const { IDui, PWui, BIOui, SIDsj } = req;
    
    try {
      // Step 1: User calculations
      const user = await User.findOne({ IDui });
      if (!user) throw new Error('User not found');
      
      // Biometric verification
      const oi = CryptoUtils.Rep(BIOui, user.deltaui);
      const MUui = CryptoUtils.xor(user.pui, 
        CryptoUtils.hash(`${user.PIDui}${PWui}${IDui}${oi}`));
      
      // Verify stored qui
      
      
      // Generate random nonce
      const rui = CryptoUtils.generateNonce();
      
      // Calculate MIDui
      const gateway = await Gateway.findOne();
      // console.log(gateway.compositeN)
      const MIDui = CryptoUtils.modPow(
        BigInt('0x' + CryptoUtils.hash(`${MUui}${user.PIDui}${rui}`)),
        2n,
        BigInt('0x' + 32)
      ).toString(16);
      
      // Calculate F1 and F2
      const F1 = CryptoUtils.xor(
        SIDsj,
        CryptoUtils.hash(`${MUui}${user.PIDui}${rui}`)
      );
      
      const F2 = CryptoUtils.hash(`${MUui}${user.Yui}${rui}${MIDui}${SIDsj}`);
      
      return {
        success: true,
        loginRequest: { F1, F2, MIDui },
        sessionData: { rui, MUui, user, SIDsj }
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  static async processGatewayAuthentication(loginRequest, sessionData) {
    try {
      const gateway = await Gateway.findOne();
      const { F1, F2, MIDui } = loginRequest;
      const { rui, MUui, user } = sessionData;
      
      // Decrypt MIDui using CRT
      const decrypted = CryptoUtils.crt(
        [BigInt('0x' + MIDui)],
        [BigInt('0x' + gateway.primeY), BigInt('0x' + gateway.primeZ)]
      );
      
      // Verify decrypted values
      // const [decMUui, decPIDui, decRui] = decrypted.toString(16).split('||');
      // if (decMUui !== MUui || decPIDui !== user.PIDui || decRui !== rui) {
      //   throw new Error('Invalid gateway authentication');
      // }
      
      // Generate random nonce
      const rg = CryptoUtils.generateNonce();
      
      // Get sensor device
      const sensor = await SensorDevice.findOne({ SIDsj: sessionData.SIDsj });
      if (!sensor) throw new Error('Sensor not found');
      
      // Calculate Ksj and related values
      const Ksj = CryptoUtils.hash(`${sensor.SIDsj}${sensor.Ysj}`);
      const Kj = CryptoUtils.xor(
        `${Ksj}${sensor.SIDsj}`,
        CryptoUtils.hash(rg)
      );
      
      const F3 = CryptoUtils.hash(`${user.PIDui}${sensor.SIDsj}${Kj}${F2}${rg}`);
      const Km = CryptoUtils.hash(`${Ksj}${F3}${rui}`);
      
      return {
        success: true,
        gwResponse: { F3, Kj, Km },
        sessionData: { ...sessionData,F2, rg, Ksj }
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  static async processSensorAuthentication(gwResponse, sessionData) {
    try {
      const { F3, Kj, Km } = gwResponse;
      const { rui, rg, Ksj, SIDsj } = sessionData;
      
      // Verify F3
      const F3Verify = CryptoUtils.hash(
        `${sessionData.user.PIDui}${SIDsj}${Kj}${sessionData.F2}${rg}`
      );
      if (F3Verify !== F3) throw new Error('Invalid sensor authentication');
      
      // Generate random nonce
      const rj = CryptoUtils.generateNonce();
      
      // Calculate F4 and session key
      const F4 = CryptoUtils.xor(rj, CryptoUtils.hash(`${SIDsj}${F3}`));
      
      const sessionKey = CryptoUtils.hash(
        `${SIDsj}${sessionData.user.PIDui}${rui}${rg}${rj}${Kj}${F4}`
      );
      
      const F5 = CryptoUtils.hash(`${Kj}${sessionKey}${F4}`);
      
      // Save session
      const session = new Session({
        userId: sessionData.user.IDui,
        sensorId: SIDsj,
        sessionKey,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
      });
      await session.save();
      
      return {
        success: true,
        sensorResponse: { F4, F5 },
        sessionData: { ...sessionData, sessionKey, rj,Kj }
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  static async finalizeKeyAgreement(sensorResponse, sessionData) {
    try {
      const { F4, F5 } = sensorResponse;
      const { rui, rg, rj, Kj, sessionKey, SIDsj, user } = sessionData;
      
      // Calculate and verify session key
      console.log(Kj)
      console.log("hello")
      const verifySessionKey = CryptoUtils.hash(
        `${SIDsj}${user.PIDui}${rui}${rg}${rj}${Kj}${F4}`
      );
      
      if (verifySessionKey !== sessionKey) {
        throw new Error('Session key verification failed');
      }
      
      const F6 = CryptoUtils.xor(rg, sessionData.MUui);
      const F7 = CryptoUtils.xor(Kj, sessionData.F2);
      const F8 = CryptoUtils.hash(`${sessionKey}${rg}${sessionData.F2}`);
      
      return {
        success: true,
        finalResponse: { F4, F6, F7, F8 },
        sessionKey
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

module.exports = AuthController;