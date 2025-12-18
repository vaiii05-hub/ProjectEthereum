const axios = require('axios');
const contractService = require('./contractService');
const { ethers } = require('ethers');

class VerificationService {
  constructor() {
    this.baseURL = process.env.BASE_URL || 'http://localhost:5000';
  }

  // Combined RTO + Blockchain verification
  async verifyVehicleComplete(vehicleNumber) {
    if (!vehicleNumber || typeof vehicleNumber !== 'string') {
      throw new Error('Valid vehicle number is required');
    }

    const results = {
      vehicleNumber: vehicleNumber.toUpperCase(),
      rtoVerification: null,
      blockchainVerification: null,
      overallStatus: 'pending',
      timestamp: new Date().toISOString()
    };

    // Step 1: RTO Verification with timeout
    try {
      const rtoResponse = await Promise.race([
        axios.get(`${this.baseURL}/api/rto/vehicle/${vehicleNumber}`, { timeout: 10000 }),
        new Promise((_, reject) => setTimeout(() => reject(new Error('RTO API timeout')), 10000))
      ]);
      
      results.rtoVerification = {
        success: rtoResponse.data.success,
        data: rtoResponse.data.rtoData,
        error: null,
        responseTime: Date.now()
      };
    } catch (error) {
      results.rtoVerification = {
        success: false,
        data: null,
        error: this.categorizeError(error),
        responseTime: Date.now()
      };
    }

    // Step 2: Blockchain Verification with timeout
    try {
      if (!process.env.RPC_URL) {
        throw new Error('Blockchain RPC URL not configured');
      }

      const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
      const blockchainData = await Promise.race([
        contractService.verifyVehicleOnBlockchain(vehicleNumber, provider),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Blockchain timeout')), 15000))
      ]);
      
      results.blockchainVerification = {
        success: blockchainData.exists,
        data: blockchainData,
        error: null,
        responseTime: Date.now()
      };
    } catch (error) {
      results.blockchainVerification = {
        success: false,
        data: null,
        error: this.categorizeError(error),
        responseTime: Date.now()
      };
    }

    // Determine overall status with detailed analysis
    if (results.rtoVerification.success && results.blockchainVerification.success) {
      results.overallStatus = 'verified';
    } else if (results.rtoVerification.success || results.blockchainVerification.success) {
      results.overallStatus = 'partial';
    } else {
      results.overallStatus = 'failed';
    }

    return results;
  }

  categorizeError(error) {
    if (error.code === 'ECONNREFUSED') {
      return 'Service unavailable - connection refused';
    }
    if (error.code === 'ETIMEDOUT' || error.message.includes('timeout')) {
      return 'Request timeout - service not responding';
    }
    if (error.response?.status === 404) {
      return 'Vehicle not found in records';
    }
    if (error.response?.status === 500) {
      return 'Internal service error';
    }
    if (error.message.includes('network')) {
      return 'Network connectivity issue';
    }
    return error.message || 'Unknown error occurred';
  }

  // Register vehicle in both RTO and Blockchain
  async registerVehicleComplete(vehicleData, privateKey) {
    // Input validation
    const { buyerName, buyerId, ownerName, vehicleNumber } = vehicleData;
    
    if (!buyerName || !buyerId || !ownerName || !vehicleNumber) {
      throw new Error('All vehicle data fields are required');
    }
    
    if (!privateKey || privateKey.length < 64) {
      throw new Error('Valid private key is required for blockchain registration');
    }

    const results = {
      vehicleNumber: vehicleNumber.toUpperCase(),
      rtoRegistration: null,
      blockchainRegistration: null,
      overallStatus: 'pending',
      timestamp: new Date().toISOString()
    };

    // Step 1: Verify RTO data exists with timeout
    try {
      const rtoResponse = await Promise.race([
        axios.get(`${this.baseURL}/api/rto/vehicle/${vehicleNumber}`, { timeout: 10000 }),
        new Promise((_, reject) => setTimeout(() => reject(new Error('RTO verification timeout')), 10000))
      ]);
      
      if (rtoResponse.data.success) {
        results.rtoRegistration = {
          success: true,
          message: 'Vehicle found in RTO records',
          data: rtoResponse.data.rtoData
        };
      } else {
        results.rtoRegistration = {
          success: false,
          message: 'Vehicle not found in RTO records',
          error: 'Vehicle does not exist in government database'
        };
      }
    } catch (error) {
      results.rtoRegistration = {
        success: false,
        message: 'RTO verification failed',
        error: this.categorizeError(error)
      };
    }

    // Step 2: Register on Blockchain (only if RTO verification passes)
    if (results.rtoRegistration.success) {
      try {
        // Validate private key format
        if (!privateKey.startsWith('0x')) {
          privateKey = '0x' + privateKey;
        }

        const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
        const signer = new ethers.Wallet(privateKey, provider);
        
        // Check wallet balance
        const balance = await provider.getBalance(signer.address);
        if (balance.toString() === '0') {
          throw new Error('Insufficient funds for gas fees');
        }
        
        const blockchainResult = await Promise.race([
          contractService.registerVehicleOnBlockchain(buyerName, buyerId, ownerName, vehicleNumber, signer),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Blockchain registration timeout')), 30000))
        ]);
        
        results.blockchainRegistration = {
          success: true,
          data: blockchainResult,
          walletAddress: signer.address
        };
      } catch (error) {
        results.blockchainRegistration = {
          success: false,
          error: this.categorizeError(error)
        };
      }
    } else {
      results.blockchainRegistration = {
        success: false,
        error: 'Skipped due to RTO verification failure'
      };
    }

    // Determine overall status
    if (results.rtoRegistration.success && results.blockchainRegistration.success) {
      results.overallStatus = 'success';
    } else if (results.rtoRegistration.success) {
      results.overallStatus = 'partial';
    } else {
      results.overallStatus = 'failed';
    }

    return results;
  }
}

module.exports = new VerificationService();