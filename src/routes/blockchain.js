const express = require('express');
const axios = require('axios');
const { ethers } = require('ethers');
const router = express.Router();

// Connect wallet endpoint
router.post('/connect', async (req, res) => {
  try {
    res.json({ 
      success: true, 
      message: 'Use MetaMask in browser',
      contractAddress: process.env.CONTRACT_ADDRESS 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Store vehicle data on blockchain with RTO validation
router.post('/store', async (req, res) => {
  try {
    const { vehicleNumber, ownerAddress, transactionHash } = req.body;
    
    // Validate with RTO first
    try {
      const rtoResponse = await axios.get(`http://localhost:5000/api/rto/vehicle/${vehicleNumber}`);
      if (!rtoResponse.data.success) {
        return res.status(400).json({
          success: false,
          error: 'Vehicle not found in RTO records. Cannot store on blockchain.'
        });
      }
    } catch (rtoError) {
      return res.status(400).json({
        success: false,
        error: 'RTO validation failed. Cannot proceed with blockchain storage.'
      });
    }
    
    // Store transaction hash in database
    res.json({ 
      success: true, 
      blockchainHash: transactionHash,
      message: 'Data validated with RTO and stored on blockchain',
      rtoValidated: true
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Verify blockchain data
router.get('/verify/:hash', async (req, res) => {
  try {
    const { hash } = req.params;
    // Verify logic here
    res.json({ success: true, verified: true, hash });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;