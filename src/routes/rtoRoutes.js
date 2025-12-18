const express = require('express');
const router = express.Router();
const rtoService = require('../services/rtoService');

// GET /api/rto/verify/:vehicleNumber - Direct RTO verification
router.get('/verify/:vehicleNumber', async (req, res) => {
  try {
    const { vehicleNumber } = req.params;
    const result = await rtoService.verifyVehicleWithRTO(vehicleNumber);
    
    if (result.success) {
      res.json(result);
    } else {
      res.status(404).json(result);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/rto/history/:vehicleNumber - Get owner history
router.get('/history/:vehicleNumber', async (req, res) => {
  try {
    const { vehicleNumber } = req.params;
    const result = await rtoService.getOwnerHistory(vehicleNumber);
    
    if (result.success) {
      res.json(result);
    } else {
      res.status(404).json(result);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/rto/status/:vehicleNumber - Check vehicle status
router.get('/status/:vehicleNumber', async (req, res) => {
  try {
    const { vehicleNumber } = req.params;
    const result = await rtoService.checkVehicleStatus(vehicleNumber);
    
    if (result.success) {
      res.json(result);
    } else {
      res.status(404).json(result);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;