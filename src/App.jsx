import React, { useState } from 'react';
import { ethers } from 'ethers';
import { registerVehicle as apiRegisterVehicle, verifyVehicle as apiVerifyVehicle, registerUser } from './services/api';
import { registerVehicleOnBlockchain, verifyVehicleOnBlockchain } from './services/blockchain';
import './App.css';

export default function App() {
  const [walletAddress, setWalletAddress] = useState(null);
  const [buyerName, setBuyerName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [useBlockchain, setUseBlockchain] = useState(true);

  // Connect wallet using MetaMask
  const connectWallet = async () => {
    if (!window.ethereum) {
      alert('MetaMask not detected. Install MetaMask and try again.');
      return;
    }
    try {
      const [account] = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });
      setWalletAddress(account);
    } catch (err) {
      console.error('User rejected or error:', err);
      alert('Could not connect wallet.');
    }
  };

  // Verify vehicle function with blockchain integration
  const verifyVehicle = async () => {
    if (!vehicleNumber) {
      showMessage('Please enter vehicle number to verify.', 'error');
      return;
    }

    setLoading(true);
    try {
      let blockchainData = null;
      let dbData = null;
      
      // Check blockchain if enabled
      if (useBlockchain) {
        showMessage('Checking blockchain... ⚡', 'info');
        const blockchainResult = await verifyVehicleOnBlockchain(vehicleNumber);
        if (blockchainResult.success) {
          blockchainData = blockchainResult.data;
        }
      }
      
      // Check database
      showMessage('Checking database... 💾', 'info');
      const dbResult = await apiVerifyVehicle(vehicleNumber);
      if (!dbResult.error) {
        dbData = dbResult;
      }
      
      if (!blockchainData && !dbData) {
        showMessage('Vehicle not found in any system.', 'error');
        setLoading(false);
        return;
      }
      
      // Display verification results
      let verificationMsg = '🔍 VEHICLE VERIFICATION RESULTS\n\n';
      
      if (blockchainData && blockchainData.isRegistered) {
        verificationMsg += `⚡ BLOCKCHAIN DATA:\n`;
        verificationMsg += `🚗 Vehicle: ${blockchainData.make} ${blockchainData.model} (${blockchainData.year})\n`;
        verificationMsg += `👤 Owner: ${blockchainData.owner}\n`;
        verificationMsg += `🔒 Status: ${blockchainData.isFraud ? 'FRAUD REPORTED' : 'AUTHENTIC'}\n\n`;
      }
      
      if (dbData) {
        verificationMsg += `💾 DATABASE DATA:\n`;
        verificationMsg += `🚗 Vehicle: ${dbData.vehicle.make} ${dbData.vehicle.model} (${dbData.vehicle.year})\n`;
        verificationMsg += `👤 Owner: ${dbData.vehicle.currentOwner.name}\n`;
        verificationMsg += `✅ Status: ${dbData.verificationStatus}\n`;
        verificationMsg += `📅 Registered: ${new Date(dbData.vehicle.registrationDate).toLocaleDateString()}`;
      }
      
      showMessage(verificationMsg, 'success');
    } catch (error) {
      showMessage('Verification failed. Check console for details.', 'error');
      console.error(error);
    }
    setLoading(false);
  };

  const showMessage = (msg, type) => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(''), 5000);
  };

  // Register vehicle function with blockchain integration
  const registerVehicle = async () => {
    if (!walletAddress) {
      showMessage('Connect wallet first.', 'error');
      return;
    }
    
    if (!vehicleNumber || !make || !model || !year || !ownerName) {
      showMessage('Please fill all required fields.', 'error');
      return;
    }

    setLoading(true);
    try {
      const vehicleData = {
        vehicleNumber,
        make,
        model,
        year: parseInt(year),
        ownerName,
        walletAddress
      };
      
      let blockchainResult = null;
      let dbResult = null;
      
      // Register on blockchain if enabled
      if (useBlockchain) {
        showMessage('Registering on blockchain... ⚡', 'info');
        blockchainResult = await registerVehicleOnBlockchain(vehicleData);
        
        if (!blockchainResult.success) {
          showMessage(`Blockchain error: ${blockchainResult.error}`, 'error');
          setLoading(false);
          return;
        }
      }
      
      // Register in database
      showMessage('Saving to database... 💾', 'info');
      dbResult = await apiRegisterVehicle({
        ...vehicleData,
        blockchainHash: blockchainResult?.txHash || null
      });
      
      if (dbResult.error) {
        showMessage(`Database error: ${dbResult.error}`, 'error');
      } else {
        const successMsg = useBlockchain 
          ? `Vehicle registered successfully! 🎉\n⚡ Blockchain: ${blockchainResult.txHash.slice(0, 10)}...\n💾 Database: Saved`
          : 'Vehicle registered in database! 🎉';
        showMessage(successMsg, 'success');
        
        // Clear form
        setVehicleNumber('');
        setMake('');
        setModel('');
        setYear('');
        setOwnerName('');
      }
    } catch (error) {
      showMessage('Registration failed. Check console for details.', 'error');
      console.error(error);
    }
    setLoading(false);
  };

  return (
    <div className="app-container">
      <header>
        <h1>
          🚗 Second-Hand Vehicle Authentication 🚗
        </h1>
        <div
          style={{
            display: 'flex',
            gap: 12,
            alignItems: 'center',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}
        >
          <button className="connect-btn" onClick={connectWallet}>
            {walletAddress ? 'Connected ✅' : 'Connect Wallet'}
          </button>
          {walletAddress && <span className="addr">{walletAddress}</span>}
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.1)', padding: '8px 16px', borderRadius: '15px' }}>
            <span style={{ fontSize: '14px' }}>Blockchain:</span>
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={useBlockchain}
                onChange={(e) => setUseBlockchain(e.target.checked)}
                style={{ marginRight: '5px' }}
              />
              {useBlockchain ? '⚡ ON' : '💾 OFF'}
            </label>
          </div>
        </div>
      </header>
      <section className="info">
        <h2>Process & Guidelines</h2>
        <ol>
          <li>Connect MetaMask.</li>
          <li>Fill Buyer & Owner details.</li>
          <li>
            Click Verify to run the demo verification (calls blockchain provider).
          </li>
        </ol>
      </section>
      <section className="details">
        <div className="card">
          <h3>Vehicle Details</h3>
          <input
            value={vehicleNumber}
            onChange={(e) => setVehicleNumber(e.target.value)}
            placeholder="Vehicle Number (Required)"
          />
          <input
            value={make}
            onChange={(e) => setMake(e.target.value)}
            placeholder="Make (e.g., Toyota)"
          />
          <input
            value={model}
            onChange={(e) => setModel(e.target.value)}
            placeholder="Model (e.g., Camry)"
          />
          <input
            value={year}
            onChange={(e) => setYear(e.target.value)}
            placeholder="Year (e.g., 2020)"
            type="number"
          />
        </div>
        <div className="card">
          <h3>Owner Details</h3>
          <input
            value={ownerName}
            onChange={(e) => setOwnerName(e.target.value)}
            placeholder="Owner Name (Required)"
          />
          <input
            value={buyerName}
            onChange={(e) => setBuyerName(e.target.value)}
            placeholder="Buyer Name (Optional)"
          />
        </div>
      </section>
      <div style={{ marginTop: 20 }}>
        <div className="action-buttons">
          <button 
            className={`register-btn ${loading ? 'loading' : ''}`} 
            onClick={registerVehicle}
            disabled={loading}
          >
            {loading ? '⏳ Processing...' : '📝 Register Vehicle'}
          </button>
          <button 
            className={`verify-btn ${loading ? 'loading' : ''}`} 
            onClick={verifyVehicle}
            disabled={loading}
          >
            {loading ? '⏳ Verifying...' : '🔍 Verify Vehicle'}
          </button>
        </div>
        {message && (
          <div className={`status-message ${messageType}`}>
            {message.split('\n').map((line, index) => (
              <div key={index}>{line}</div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}