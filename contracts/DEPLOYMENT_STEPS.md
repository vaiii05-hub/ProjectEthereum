# 🚀 Smart Contract Deployment Guide

## Step 1: Open Remix IDE
Go to: https://remix.ethereum.org

## Step 2: Create Contract File
1. Click "Create New File"
2. Name: `VehicleRegistry.sol`
3. Copy the contract code from `contracts/VehicleRegistry.sol`

## Step 3: Compile Contract
1. Go to "Solidity Compiler" tab
2. Select compiler version: 0.8.19 or higher
3. Click "Compile VehicleRegistry.sol"
4. Check for green checkmark ✅

## Step 4: Deploy Contract
1. Go to "Deploy & Run Transactions" tab
2. Environment: Select "Injected Provider - MetaMask"
3. Make sure MetaMask is connected to Sepolia testnet
4. Select contract: "VehicleRegistry"
5. Click "Deploy"
6. Confirm transaction in MetaMask

## Step 5: Get Contract Details
After deployment:
1. Copy contract address from deployed contracts section
2. Copy ABI from compilation artifacts

## Step 6: Update Frontend
Replace contract address in:
- `vehicleRegistration/src/services/blockchain.js`
- Line 3: `const CONTRACT_ADDRESS = "YOUR_NEW_ADDRESS";`

## 🌐 Network Setup (Sepolia Testnet)
- Network Name: Sepolia
- RPC URL: https://sepolia.infura.io/v3/demo
- Chain ID: 11155111
- Currency: ETH
- Block Explorer: https://sepolia.etherscan.io

## 💰 Get Test ETH
- https://sepoliafaucet.com
- https://faucet.sepolia.dev

## ✅ Verification
After deployment, test:
1. Register vehicle with "Blockchain: ON"
2. Verify vehicle
3. Check transaction on Sepolia Etherscan