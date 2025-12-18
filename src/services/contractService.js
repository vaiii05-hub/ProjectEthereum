const { ethers } = require('ethers');
const contractABI = require('../contracts/VehicleRegistry.json');

class ContractService {
  constructor() {
    this.contractAddress = process.env.CONTRACT_ADDRESS;
    this.abi = contractABI.abi;
  }

  async getContract(signer) {
    return new ethers.Contract(this.contractAddress, this.abi, signer);
  }

  async registerVehicleOnBlockchain(buyerName, buyerId, ownerName, vehicleNumber, signer) {
    try {
      const contract = await this.getContract(signer);
      
      // Estimate gas
      const gasEstimate = await contract.estimateGas.registerVehicle(buyerName, buyerId, ownerName, vehicleNumber);
      
      const tx = await contract.registerVehicle(buyerName, buyerId, ownerName, vehicleNumber, {
        gasLimit: gasEstimate.mul(120).div(100) // 20% buffer
      });
      
      const receipt = await tx.wait();
      
      return {
        success: true,
        transactionHash: receipt.transactionHash,
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed.toString()
      };
    } catch (error) {
      throw new Error(`Blockchain registration failed: ${error.message}`);
    }
  }

  async verifyVehicleOnBlockchain(vehicleNumber, provider) {
    try {
      const contract = new ethers.Contract(this.contractAddress, this.abi, provider);
      const [exists, owner, timestamp] = await contract.verifyVehicle(vehicleNumber);
      
      return {
        exists,
        owner,
        timestamp: timestamp.toString(),
        registrationDate: new Date(Number(timestamp) * 1000).toISOString()
      };
    } catch (error) {
      throw new Error(`Blockchain verification failed: ${error.message}`);
    }
  }
}

module.exports = new ContractService();