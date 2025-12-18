const express = require('express');
const axios = require('axios');
const memoryStorage = require('../storage/memoryStorage');
const router = express.Router();

// Get all vehicles
router.get('/', async (req, res) => {
  try {
    const vehicles = await memoryStorage.getAllVehicles();
    res.json({ success: true, vehicles });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add vehicle
router.post('/', async (req, res) => {
  try {
    const { vehicleNumber, ownerName, ownerAddress } = req.body;
    
    const vehicleData = {
      vehicleNumber,
      ownerName,
      ownerAddress,
      verified: false
    };
    
    const vehicle = await memoryStorage.saveVehicle(vehicleData);
    res.json({ success: true, message: 'Vehicle added', vehicle });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Verify vehicle
router.get('/verify/:vehicleNumber', async (req, res) => {
  try {
    const { vehicleNumber } = req.params;
    const vehicle = await memoryStorage.findVehicle(vehicleNumber);
    
    if (!vehicle) {
      return res.json({ success: false, message: 'Vehicle not found' });
    }
    
    res.json({ success: true, verified: true, vehicle });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// RTO Verification
router.get('/rto-verify/:vehicleNumber', async (req, res) => {
  try {
    const { vehicleNumber } = req.params;
    
    // Call internal RTO API
    const rtoResponse = await axios.get(`http://localhost:5000/api/rto/vehicle/${vehicleNumber}`);
    
    res.json({
      success: true,
      rtoVerified: rtoResponse.data.success,
      rtoData: rtoResponse.data.rtoData
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;