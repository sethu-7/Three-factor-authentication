// // File: routes/wsn.js
// const express = require('express');
// const router = express.Router();
// const AuthController = require('../controllers/AuthController');

// // Key Agreement Phase
// router.post('/auth/initiate', async (req, res) => {
//   const result = await AuthController.initiateKeyAgreement(req.body);
//   if (result.success) {
//     req.session.authData = result.sessionData;
//     res.json({ success: true, loginRequest: result.loginRequest });
//   } else {
//     res.status(400).json({ success: false, error: result.error });
//   }
// });

// router.post('/auth/gateway', async (req, res) => {
//   if (!req.session.authData) {
//     return res.status(401).json({ success: false, error: 'Invalid session' });
//   }
  
//   const result = await AuthController.processGatewayAuthentication(
//     req.body,
//     req.session.authData
//   );
  
//   if (result.success) {
//     req.session.authData = result.sessionData;
//     res.json({ success: true, gwResponse: result.gwResponse });
//   } else {
//     res.status(400).json({ success: false, error: result.error });
//   }
// });

// router.post('/auth/sensor', async (req, res) => {
//   if (!req.session.authData) {
//     return res.status(401).json({ success: false, error: 'Invalid session' });
//   }
  
//   const result = await AuthController.processSensorAuthentication(
//     req.body,
//     req.session.authData
//   );
  
//   if (result.success) {
//     req.session.authData = result.sessionData;
//     res.json({ success: true, sensorResponse: result.sensorResponse });
//   } else {
//     res.status(400).json({ success: false, error: result.error });
//   }
// });

// router.post('/auth/finalize', async (req, res) => {
//   if (!req.session.authData) {
//     return res.status(401).json({ success: false, error: 'Invalid session' });
//   }
  
//   const result = await AuthController.finalizeKeyAgreement(
//     req.body,
//     req.session.authData
//   );
  
//   if (result.success) {
//     delete req.session.authData; // Clear session data
//     res.json({
//       success: true,
//       finalResponse: result.finalResponse,
//       sessionKey: result.sessionKey
//     });
//   } else {
//     res.status(400).json({ success: false, error: result.error });
//   }
// });

// module.exports = router;


// // File: routes/wsn.js
// const express = require('express');
// const router = express.Router();
// const GatewayController = require('../controllers/gatewayController.js');
// const SensorDeviceController = require('../controllers/sensorDeviceController');
// const UserController = require('../controllers/userController');
// const AuthController=require('../controllers/authControllers.js')
// const Gateway = require('../models/gateway');


// router.get('/try',(req,res)=>{
//   res.send("hello try")
// })

// // Gateway initialization
// router.post('/gateway/init', async (req, res) => {
//   const result = await GatewayController.initialize();
//   res.json(result);
// });

// // Sensor device registration
// router.post('/sensor/register', async (req, res) => {
//   const { IDsj } = req.body;
//   const result = await SensorDeviceController.register(IDsj);
//   res.json(result);
// });

// // User registration
// router.post('/user/register', async (req, res) => {
//   const { IDui, PWui, BIOui } = req.body;
//   const result = await UserController.register(IDui, PWui, BIOui);
//   res.json(result);
// });

// router.post('/key-agreement', async (req, res) => {
//   const { IDui, PWui, BIOui ,SIDsj} = req.body;
  
//   console.log(SIDsj)
//   // console.log(key)
//   const result = await AuthController.initiateKeyAgreement(IDui, PWui, BIOui, SIDsj);
//   res.json(result);
// });


// module.exports = router;

const express = require('express');
const router = express.Router();
const GatewayController = require('../controllers/gatewayController');
const SensorDeviceController = require('../controllers/sensorDeviceController');
const UserController = require('../controllers/userController');
const AuthController = require('../controllers/authControllers');

// Health check route
router.get('/try', (req, res) => {
  res.send("Wireless Sensor Network API is running");
});

// Gateway initialization
router.post('/gateway/init', async (req, res) => {
  try {
    const result = await GatewayController.initialize();
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Sensor device registration
router.post('/sensor/register', async (req, res) => {
  try {
    const { IDsj } = req.body;
    if (!IDsj) {
      return res.status(400).json({ success: false, error: 'Sensor ID is required' });
    }
    const result = await SensorDeviceController.register(IDsj);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// User registration
router.post('/user/register', async (req, res) => {
  try {
    const { IDui, PWui, BIOui } = req.body;
    if (!IDui || !PWui || !BIOui) {
      return res.status(400).json({ success: false, error: 'Missing required registration parameters' });
    }
    const result = await UserController.register(IDui, PWui, BIOui);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Key Agreement Initiation
router.post('/key-agreement/initiate', async (req, res) => {
  try {
    const { IDui, PWui, BIOui, SIDsj } = req.body;
    if (!IDui || !PWui || !BIOui || !SIDsj) {
      return res.status(400).json({ success: false, error: 'Missing required key agreement parameters' });
    }
    const result = await AuthController.initiateKeyAgreement(IDui, PWui, BIOui, SIDsj);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Gateway Authentication
router.post('/key-agreement/gateway-auth', async (req, res) => {
  try {
    const { loginRequest, sessionData } = req.body;
    if (!loginRequest || !sessionData) {
      return res.status(400).json({ success: false, error: 'Missing authentication parameters' });
    }
    const result = await AuthController.processGatewayAuthentication(loginRequest, sessionData);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Sensor Authentication
router.post('/key-agreement/sensor-auth', async (req, res) => {
  try {
    const { gwResponse, sessionData } = req.body;
    if (!gwResponse || !sessionData) {
      return res.status(400).json({ success: false, error: 'Missing sensor authentication parameters' });
    }
    const result = await AuthController.processSensorAuthentication(gwResponse, sessionData);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Finalize Key Agreement
router.post('/key-agreement/finalize', async (req, res) => {
  try {
    const { sensorResponse, sessionData } = req.body;
    if (!sensorResponse || !sessionData) {
      return res.status(400).json({ success: false, error: 'Missing finalization parameters' });
    }
    const result = await AuthController.finalizeKeyAgreement(sensorResponse, sessionData);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
