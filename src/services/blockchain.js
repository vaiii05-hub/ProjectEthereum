import { ethers } from 'ethers';

const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Deployed on Sepolia testnet
const CONTRACT_ABI = [
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
  },
  {
    "inputs": [{"internalType": "string", "name": "_vehicleNumber", "type": "string"}, {"internalType": "address", "name": "_newOwner", "type": "address"}],
    "name": "transferOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [{"indexed": false, "internalType": "string", "name": "vehicleNumber", "type": "string"}, {"indexed": false, "internalType": "address", "name": "owner", "type": "address"}, {"indexed": false, "internalType": "uint256", "name": "timestamp", "type": "uint256"}],
    "name": "VehicleRegistered",
    "type": "event"
  }
];

export const getContract = async () => {
  if (!window.ethereum) throw new Error("MetaMask not found");
  
  const provider = new ethers.BrowserProvider(window.ethereum);
  
  // Check if on correct network (Sepolia)
  const network = await provider.getNetwork();
  if (network.chainId !== 11155111n) {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0xaa36a7' }], // Sepolia chainId
      });
    } catch (error) {
      throw new Error('Please switch to Sepolia testnet');
    }
  }
  
  const signer = await provider.getSigner();
  return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
};

export const registerVehicleOnBlockchain = async (vehicleData) => {
  try {
    const contract = await getContract();
    const tx = await contract.registerVehicle(
      vehicleData.vehicleNumber,
      vehicleData.make,
      vehicleData.model,
      vehicleData.year
    );
    const receipt = await tx.wait();
    return { success: true, txHash: receipt.hash, receipt };
  } catch (error) {
    console.error('Blockchain registration error:', error);
    return { success: false, error: error.message };
  }
};

export const verifyVehicleOnBlockchain = async (vehicleNumber) => {
  try {
    const contract = await getContract();
    const result = await contract.verifyVehicle(vehicleNumber);
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
    console.error('Blockchain verification error:', error);
    return { success: false, error: error.message };
  }
};

export const transferOwnershipOnBlockchain = async (vehicleNumber, newOwnerAddress) => {
  try {
    const contract = await getContract();
    const tx = await contract.transferOwnership(vehicleNumber, newOwnerAddress);
    const receipt = await tx.wait();
    return { success: true, txHash: receipt.hash, receipt };
  } catch (error) {
    console.error('Blockchain transfer error:', error);
    return { success: false, error: error.message };
  }
};