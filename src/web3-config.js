const { ethers } = require('ethers');

// MetaMask connection configuration
const connectWallet = async () => {
  if (typeof window !== 'undefined' && window.ethereum) {
    try {
      // Request account access
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      // Create provider
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      
      console.log('Wallet connected:', await signer.getAddress());
      return { provider, signer };
    } catch (error) {
      console.error('Wallet connection failed:', error);
      throw error;
    }
  } else {
    throw new Error('MetaMask not installed');
  }
};

module.exports = { connectWallet };