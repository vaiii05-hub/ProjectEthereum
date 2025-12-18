// Frontend wallet integration
const connectMetaMask = async () => {
  if (!window.ethereum) {
    alert('MetaMask not installed!');
    return;
  }

  try {
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts'
    });
    
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    
    return {
      account: accounts[0],
      provider,
      signer
    };
  } catch (error) {
    console.error('Connection failed:', error);
  }
};

// Network switching
const switchToPolygon = async () => {
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: '0x89' }], // Polygon Mainnet
    });
  } catch (error) {
    console.error('Network switch failed:', error);
  }
};

module.exports = { connectMetaMask, switchToPolygon };