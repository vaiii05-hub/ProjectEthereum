const { ethers } = require('ethers');

// Backend blockchain service for server-side operations
class BlockchainService {
  constructor() {
    this.provider = null;
    this.contract = null;
    this.contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
    this.contractABI = [
      {
        "inputs": [{"internalType": "string", "name": "_vehicleNumber", "type": "string"}, {"internalType": "string", "name": "_make", "type": "string"}, {"internalType": "string", "name": "_model", "type": "string"}, {"internalType": "uint256", "name": "_year", "type": "uint256"}],
        "name": "registerVehicle",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [{"internalType": "string", "name": "_vehicleNumber", "type": "string"}],
        "name": "verifyVehicle",
        "outputs": [{"internalType": "string", "name": "make", "type": "string"}, {"internalType": "string", "name": "model", "type": "string"}, {"internalType": "uint256", "name": "year", "type": "uint256"}, {"internalType": "address", "name": "owner", "type": "address"}, {"internalType": "bool", "name": "isRegistered", "type": "bool"}, {"internalType": "bool", "name": "isFraud", "type": "bool"}],
        "stateMutability": "view",
        "type": "function"
      }
    ];
  }

  async initialize() {
    try {
      // Use Sepolia testnet
      this.provider = new ethers.JsonRpcProvider(
        process.env.ETHEREUM_RPC_URL || 'https://sepolia.infura.io/v3/demo'
      );
      
      // Create contract instance (read-only)
      this.contract = new ethers.Contract(
        this.contractAddress,
        this.contractABI,
        this.provider
      );
      
      console.log('✅ Blockchain service initialized');
      return true;
    } catch (error) {
      console.log('❌ Blockchain service failed to initialize:', error.message);
      return false;
    }
  }

  async verifyVehicleOnChain(vehicleNumber) {
    try {
      if (!this.contract) {
        await this.initialize();
      }
      
      const result = await this.contract.verifyVehicle(vehicleNumber);
      return {
        success: true,
        data: {
          make: result[0],
          model: result[1],
          year: Number(result[2]),
          owner: result[3],
          isRegistered: result[4],
          isFraud: result[5]
        }
      };
    } catch (error) {
      console.log('Blockchain verification error:', error.message);
      return { success: false, error: error.message };
    }
  }

  async getTransactionDetails(txHash) {
    try {
      if (!this.provider) {
        await this.initialize();
      }
      
      const tx = await this.provider.getTransaction(txHash);
      const receipt = await this.provider.getTransactionReceipt(txHash);
      
      return {
        success: true,
        transaction: tx,
        receipt: receipt
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

module.exports = new BlockchainService();