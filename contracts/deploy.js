// Simple deployment script for VehicleRegistry contract
// Run with: node deploy.js

const { ethers } = require('ethers');
require('dotenv').config();

async function deployContract() {
  // Connect to Sepolia testnet
  const provider = new ethers.JsonRpcProvider('https://sepolia.infura.io/v3/YOUR_INFURA_KEY');
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

  console.log('Deploying contract with account:', wallet.address);

  // Contract bytecode and ABI (you'll need to compile the Solidity first)
  const contractFactory = new ethers.ContractFactory(
    CONTRACT_ABI, // Add compiled ABI here
    CONTRACT_BYTECODE, // Add compiled bytecode here
    wallet
  );

  console.log('Deploying VehicleRegistry contract...');
  const contract = await contractFactory.deploy();
  await contract.waitForDeployment();

  console.log('Contract deployed to:', await contract.getAddress());
  console.log('Transaction hash:', contract.deploymentTransaction().hash);
}

// For now, just log the contract code for manual deployment
console.log(`
📋 DEPLOYMENT INSTRUCTIONS:

1. Go to Remix IDE (https://remix.ethereum.org)
2. Create new file: VehicleRegistry.sol
3. Copy the contract code from contracts/VehicleRegistry.sol
4. Compile with Solidity 0.8.0+
5. Deploy to Sepolia testnet
6. Copy contract address to blockchain.js

🔗 Get Sepolia ETH: https://sepoliafaucet.com
🔗 Add Sepolia to MetaMask: https://chainlist.org

Contract is ready for deployment! 🚀
`);

module.exports = { deployContract };