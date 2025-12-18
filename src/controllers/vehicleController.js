const memoryDB = require('../db/memoryDB');
const blockchainService = require('../services/blockchainService');
const rtoService = require('../services/rtoService');
const { ethers } = require('ethers');

// Register new vehicle
const registerVehicle = async (req, res) => {
  try {
    const { vehicleNumber, make, model, year, ownerName, walletAddress } = req.body;

    const existingVehicle = memoryDB.findVehicleByNumber(vehicleNumber);
    if (existingVehicle) {
      return res.status(400).json({ error: 'Vehicle already registered' });
    }

    const vehicleData = {
      vehicleNumber,
      make,
      model,
      year,
      currentOwner: {
        name: ownerName,
        walletAddress
      }
    };

    const vehicle = memoryDB.saveVehicle(vehicleData);
    res.status(201).json({ message: 'Vehicle registered successfully', vehicle });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Verify vehicle with RTO, blockchain, and database integration
const verifyVehicle = async (req, res) => {
  try {
    const { vehicleNumber } = req.params;
    
    // Check all three sources simultaneously
    const [dbVehicle, blockchainResult, rtoResult, rtoHistory, rtoStatus] = await Promise.all([
      Promise.resolve(memoryDB.findVehicleByNumber(vehicleNumber)),
      blockchainService.verifyVehicleOnChain(vehicleNumber),
      rtoService.verifyVehicleWithRTO(vehicleNumber),
      rtoService.getOwnerHistory(vehicleNumber),
      rtoService.checkVehicleStatus(vehicleNumber)
    ]);
    
    // Check if vehicle exists in any system
    const foundInDB = !!dbVehicle;
    const foundInBlockchain = blockchainResult.success && blockchainResult.data.isRegistered;
    const foundInRTO = rtoResult.success && rtoResult.data.status !== 'NOT_FOUND';
    
    if (!foundInDB && !foundInBlockchain && !foundInRTO) {
      return res.status(404).json({ 
        error: 'Vehicle not found in any system (Database, Blockchain, RTO)',
        vehicleNumber 
      });
    }

    // Compile comprehensive response
    const response = {
      vehicleNumber,
      verificationSummary: {
        foundInDatabase: foundInDB,
        foundInBlockchain: foundInBlockchain,
        foundInRTO: foundInRTO,
        overallStatus: foundInRTO ? 'RTO_VERIFIED' : (foundInDB || foundInBlockchain) ? 'PARTIALLY_VERIFIED' : 'NOT_VERIFIED'
      },
      
      // RTO Data (Government Source - Most Authoritative)
      rtoData: rtoResult.success ? {
        ...rtoResult.data,
        ownerHistory: rtoHistory.success ? rtoHistory.data : [],
        vehicleStatus: rtoStatus.success ? rtoStatus.data : null,
        verificationStatus: 'RTO_VERIFIED',
        isAuthentic: !rtoResult.data.isStolen && !rtoResult.data.isBlacklisted
      } : null,
      
      // Database Data (Our System)
      database: foundInDB ? {
        vehicle: dbVehicle,
        isAuthentic: !dbVehicle.isFraud,
        verificationStatus: dbVehicle.isVerified ? 'Verified' : 'Pending'
      } : null,
      
      // Blockchain Data (Decentralized)
      blockchain: foundInBlockchain ? {
        data: blockchainResult.data,
        isAuthentic: !blockchainResult.data.isFraud,
        verificationStatus: 'Blockchain_Verified'
      } : null,
      
      // Cross-verification results
      crossVerification: {
        ownershipMatch: foundInRTO && foundInDB ? 
          (rtoResult.data.currentOwner?.name?.toLowerCase().includes(dbVehicle.currentOwner.name.toLowerCase())) : null,
        vehicleDetailsMatch: foundInRTO && foundInDB ?
          (rtoResult.data.make === dbVehicle.make && rtoResult.data.model === dbVehicle.model) : null,
        noDiscrepancies: foundInRTO ? !rtoResult.data.isStolen && !rtoResult.data.isBlacklisted : true
      },
      
      // Legacy format for frontend compatibility
      vehicle: rtoResult.success ? {
        vehicleNumber,
        make: rtoResult.data.make,
        model: rtoResult.data.model,
        year: rtoResult.data.year,
        currentOwner: {
          name: rtoResult.data.currentOwner?.name || 'Unknown',
          walletAddress: dbVehicle?.currentOwner?.walletAddress || '0x0'
        },
        registrationDate: rtoResult.data.registrationDate || new Date()
      } : (dbVehicle || {
        vehicleNumber,
        make: blockchainResult.data?.make || 'Unknown',
        model: blockchainResult.data?.model || 'Unknown',
        year: blockchainResult.data?.year || 0,
        currentOwner: {
          name: 'Unknown',
          walletAddress: blockchainResult.data?.owner || '0x0'
        },
        registrationDate: new Date()
      }),
      
      isAuthentic: foundInRTO ? 
        (!rtoResult.data.isStolen && !rtoResult.data.isBlacklisted) : 
        (foundInDB ? !dbVehicle.isFraud : true),
      verificationStatus: foundInRTO ? 'RTO_VERIFIED' : 'PARTIAL_VERIFICATION'
    };

    res.json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Transfer ownership
const transferOwnership = async (req, res) => {
  try {
    const { vehicleNumber } = req.params;
    const { newOwnerName, newWalletAddress } = req.body;

    const vehicle = memoryDB.findVehicleByNumber(vehicleNumber);
    if (!vehicle) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }

    // Add current owner to previous owners
    if (!vehicle.previousOwners) vehicle.previousOwners = [];
    vehicle.previousOwners.push({
      ...vehicle.currentOwner,
      transferDate: new Date()
    });

    // Update current owner
    const updatedVehicle = memoryDB.updateVehicle(vehicleNumber, {
      currentOwner: {
        name: newOwnerName,
        walletAddress: newWalletAddress
      },
      previousOwners: vehicle.previousOwners
    });

    res.json({ message: 'Ownership transferred successfully', vehicle: updatedVehicle });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  registerVehicle,
  verifyVehicle,
  transferOwnership
};