const express = require('express');
const verificationService = require('../services/verificationService');
const router = express.Router();

// Complete vehicle verification (RTO + Blockchain)
router.get('/complete/:vehicleNumber', async (req, res, next) => {
  try {
    const { vehicleNumber } = req.params;
    
    // Input validation
    if (!vehicleNumber || vehicleNumber.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Vehicle number is required',
        code: 'INVALID_INPUT'
      });
    }

    if (vehicleNumber.length < 4 || vehicleNumber.length > 15) {
      return res.status(400).json({
        success: false,
        error: 'Invalid vehicle number format',
        code: 'INVALID_FORMAT'
      });
    }

    const results = await verificationService.verifyVehicleComplete(vehicleNumber);
    
    res.json({
      success: true,
      results,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
});

// Complete vehicle registration (RTO validation + Blockchain registration)
router.post('/register-complete', async (req, res, next) => {
  try {
    const { buyerName, buyerId, ownerName, vehicleNumber, privateKey } = req.body;
    
    // Input validation
    const requiredFields = { buyerName, buyerId, ownerName, vehicleNumber, privateKey };
    const missingFields = Object.entries(requiredFields)
      .filter(([key, value]) => !value || value.trim().length === 0)
      .map(([key]) => key);
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        error: `Missing required fields: ${missingFields.join(', ')}`,
        code: 'MISSING_FIELDS',
        missingFields
      });
    }

    // Validate private key format
    if (privateKey.length < 64) {
      return res.status(400).json({
        success: false,
        error: 'Invalid private key format',
        code: 'INVALID_PRIVATE_KEY'
      });
    }
    
    const vehicleData = { buyerName, buyerId, ownerName, vehicleNumber };
    const results = await verificationService.registerVehicleComplete(vehicleData, privateKey);
    
    const statusCode = results.overallStatus === 'success' ? 200 : 
                      results.overallStatus === 'partial' ? 206 : 400;
    
    res.status(statusCode).json({
      success: results.overallStatus === 'success',
      results,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
});

// Cross-verification endpoint
router.get('/cross-verify/:vehicleNumber', async (req, res) => {
  try {
    const { vehicleNumber } = req.params;
    const results = await verificationService.verifyVehicleComplete(vehicleNumber);
    
    // Compare RTO and Blockchain data
    const comparison = {
      vehicleNumber,
      dataMatch: false,
      discrepancies: [],
      recommendation: 'unknown'
    };
    
    if (results.rtoVerification.success && results.blockchainVerification.success) {
      const rtoData = results.rtoVerification.data;
      const blockchainData = results.blockchainVerification.data;
      
      // Compare owner names
      if (rtoData.ownerName !== blockchainData.ownerName) {
        comparison.discrepancies.push('Owner name mismatch');
      }
      
      // Compare vehicle numbers
      if (rtoData.vehicleNumber !== blockchainData.vehicleNumber) {
        comparison.discrepancies.push('Vehicle number mismatch');
      }
      
      comparison.dataMatch = comparison.discrepancies.length === 0;
      comparison.recommendation = comparison.dataMatch ? 'trusted' : 'investigate';
    } else {
      comparison.recommendation = 'incomplete_data';
    }
    
    res.json({
      success: true,
      verification: results,
      comparison
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;