const express = require('express');
const router = express.Router();
const { registerVehicle, verifyVehicle, transferOwnership } = require('../controllers/vehicleController');

// POST /api/vehicles/register
router.post('/register', registerVehicle);

// GET /api/vehicles/verify/:vehicleNumber
router.get('/verify/:vehicleNumber', verifyVehicle);

// PUT /api/vehicles/transfer/:vehicleNumber
router.put('/transfer/:vehicleNumber', transferOwnership);

module.exports = router;