// Contract configuration - Sepolia Testnet
const CONTRACT_ADDRESS = "0xc089e064FbA6756f1179E11a75352FE0EaE2aC34";
const SEPOLIA_CHAIN_ID = "0xaa36a7"; // 11155111 in hex
const CONTRACT_ABI = [
  {
    "inputs": [
      {"internalType": "string", "name": "_buyerName", "type": "string"},
      {"internalType": "string", "name": "_buyerId", "type": "string"},
      {"internalType": "string", "name": "_ownerName", "type": "string"},
      {"internalType": "string", "name": "_vehicleNumber", "type": "string"}
    ],
    "name": "registerVehicle",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "string", "name": "_vehicleNumber", "type": "string"}],
    "name": "verifyVehicle",
    "outputs": [
      {"internalType": "string", "name": "buyerName", "type": "string"},
      {"internalType": "string", "name": "buyerId", "type": "string"},
      {"internalType": "string", "name": "ownerName", "type": "string"},
      {"internalType": "string", "name": "vehicleNumber", "type": "string"},
      {"internalType": "address", "name": "registeredBy", "type": "address"},
      {"internalType": "uint8", "name": "vehicleStatus", "type": "uint8"}
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

// Network switching function
async function switchToSepolia() {
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: SEPOLIA_CHAIN_ID }],
    });
  } catch (switchError) {
    if (switchError.code === 4902) {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [{
          chainId: SEPOLIA_CHAIN_ID,
          chainName: 'Sepolia Testnet',
          rpcUrls: ['https://sepolia.infura.io/v3/'],
          nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 }
        }]
      });
    }
  }
}

// Contract functions
async function registerVehicleOnBlockchain(buyerName, buyerId, ownerName, vehicleNumber) {
  if (!provider || !signer) {
    throw new Error('Wallet not connected');
  }
  
  try {
    await switchToSepolia();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
    const tx = await contract.registerVehicle(buyerName, buyerId, ownerName, vehicleNumber);
    
    console.log('Transaction sent:', tx.hash);
    const receipt = await tx.wait();
    console.log('Transaction confirmed:', receipt);
    
    return {
      success: true,
      transactionHash: receipt.transactionHash,
      blockNumber: receipt.blockNumber
    };
  } catch (error) {
    console.error('Blockchain registration failed:', error);
    throw error;
  }
}

async function verifyVehicleOnBlockchain(vehicleNumber) {
  if (!provider) {
    throw new Error('Provider not available');
  }
  
  try {
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
    const [buyerName, buyerId, ownerName, vehicleNum, registeredBy, status] = await contract.verifyVehicle(vehicleNumber);
    
    const statusText = status === 0 ? 'Registered' : 'Unknown';
    
    return {
      exists: buyerName !== '',
      buyerName,
      buyerId,
      ownerName,
      vehicleNumber: vehicleNum,
      registeredBy,
      status: statusText
    };
  } catch (error) {
    console.error('Blockchain verification failed:', error);
    throw error;
  }
}