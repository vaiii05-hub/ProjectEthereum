// Automated deployment script for VehicleRegistry
// Run this in browser console on Remix IDE

async function deployVehicleRegistry() {
  console.log("🚀 Starting VehicleRegistry deployment...");
  
  try {
    // Check if MetaMask is connected
    if (!window.ethereum) {
      throw new Error("MetaMask not found!");
    }
    
    // Request account access
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    
    // Check network (Sepolia = 11155111)
    const chainId = await window.ethereum.request({ method: 'eth_chainId' });
    if (chainId !== '0xaa36a7') {
      console.log("⚠️ Please switch to Sepolia testnet");
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0xaa36a7' }],
      });
    }
    
    console.log("✅ Network: Sepolia Testnet");
    console.log("✅ MetaMask connected");
    
    // Contract deployment will be done through Remix IDE interface
    console.log("📋 Next steps:");
    console.log("1. Compile VehicleRegistry.sol in Remix");
    console.log("2. Deploy using 'Deploy & Run Transactions' tab");
    console.log("3. Copy contract address");
    console.log("4. Update frontend with new address");
    
    return true;
  } catch (error) {
    console.error("❌ Deployment failed:", error.message);
    return false;
  }
}

// Auto-run deployment check
deployVehicleRegistry();