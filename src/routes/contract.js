const express = require('express');
const { ethers } = require('ethers');
const contractService = require('../services/contractService');
const router = express.Router();

// Contract info endpoint
router.get('/info', (req, res) => {
  res.json({
    success: true,
    contractAddress: process.env.CONTRACT_ADDRESS,
    network: process.env.NETWORK_NAME,
    chainId: process.env.CHAIN_ID
  });
});

// Register vehicle via backend
router.post('/register', async (req, res) => {
  try {
    const { buyerName, buyerId, ownerName, vehicleNumber, privateKey } = req.body;
    
    if (!privateKey) {
      return res.status(400).json({ 
        success: false, 
        error: 'Private key required for backend registration' 
      });
    }
    
    // Create provider and signer
    const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
    const signer = new ethers.Wallet(privateKey, provider);
    
    const result = await contractService.registerVehicleOnBlockchain(
      buyerName, buyerId, ownerName, vehicleNumber, signer
    );
    
    res.json(result);
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Verify vehicle via backend
router.get('/verify/:vehicleNumber', async (req, res) => {
  try {
    const { vehicleNumber } = req.params;
    
    const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
    const result = await contractService.verifyVehicleOnBlockchain(vehicleNumber, provider);
    
    res.json({
      success: true,
      vehicleNumber,
      data: result
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

module.exports = router;