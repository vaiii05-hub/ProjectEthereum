import React, { useState } from'react';
import {ethers } from'ethers';
import './App.css';
export default function App() {
const[walletAddress, setWalletAddress] =useState(null);
const[buyerName,setBuyerName] = useState(');
const[ownerName, setOwnerName]= useState(');
// Connectwallet using MetaMask
constconnectWallet =async () => {
if (!window.ethereum) {
alert('MetaMask notdetected. Install MetaMask and try again.');
return;
}
try {
const [account] = awaitwindow.ethereum.request({
method:'eth_requestAccounts',
});
setWalletAddress(account);
} catch(err) {
console.error('User rejected or error:', err);
alert('Could not connect wallet.');
}
};
// Exampleverify function using ethers
constverifyVehicle =async () => {
if (!walletAddress) {
alert('Connect wallet first.');
return;
}
try {
const provider= new ethers.BrowserProvider(window.ethereum); //ethers v6
const network = await provider.getNetwork();
const balance= await provider.getBalance(walletAddress);
const etherStr =ethers.formatEther(balance);
alert(
`DemoVerification:
Buyer: ${buyerName||'(not provided)'}
Owner: ${ownerName|| '(not provided)'}
Wallet: ${walletAddress}
Network: ${network.name} (chainId ${network.chainId})
Balance: ${etherStr}ETH`
);
} catch(err) {
console.error(err);
alert('Verification failed (check console).');
}
};
// Placeholder registration function
constregisterVehicle = () => {
alert(
`Register Vehicle:\nBuyer: ${buyerName || '(not provided)'}\nOwner: ${ownerName ||
'(not provided)'}`
);
};
return (
<div className="app-container">
<header>
<h1>
🚗
Second-HandVehicleAuthentication 
�
�
</h1>
<div
style={{
display: 'flex',
gap: 12,
alignItems: 'center',
justifyContent: 'center',
}}
>
<button className="connect-btn" onClick={connectWallet}>
{walletAddress ?'Connected 
✅
' : 'Connect Wallet'}
</button>
{walletAddress && <span className="addr">{walletAddress}</span>}
</div>
</header>
<section className="info">
<h2>Process& Guidelines</h2>
<ol>
<li>Connect MetaMask.</li>
<li>Fill Buyer & Owner details.</li>
<li>
Click Verify to run the demoverification (callsblockchain
provider).
</li>
</ol>
</section>
<section className="details">
<div className="card">
<h3>Buyer Details</h3>
<input
value={buyerName}
onChange={(e) => setBuyerName(e.target.value)}
placeholder="Buyername"
/>
<input placeholder="Buyer ID (optional)" />
</div>
<div className="card">
<h3>Owner Details</h3>
<input
value={ownerName}
onChange={(e) => setOwnerName(e.target.value)}
placeholder="Owner name"
/>
<input placeholder="Vehicle number (optional)" />
</div>
</section>
<div style={{ marginTop: 20 }}>
<div className="action-buttons">
<button className="register-btn" onClick={registerVehicle}>
📝
RegisterVehicle
</button>
<button className="verify-btn" onClick={verifyVehicle}>
🔍
VerifyVehicle
</button>
</div>
</div>
</div>
);
}  
