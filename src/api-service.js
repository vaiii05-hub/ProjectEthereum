// Frontend API calls
const API_BASE = 'http://localhost:5000/api';

const apiService = {
  // Vehicle APIs
  getAllVehicles: () => fetch(`${API_BASE}/vehicles`).then(res => res.json()),
  
  addVehicle: (data) => fetch(`${API_BASE}/vehicles`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(res => res.json()),
  
  verifyVehicle: (vehicleNumber) => 
    fetch(`${API_BASE}/vehicles/verify/${vehicleNumber}`).then(res => res.json()),
  
  // Blockchain APIs
  connectWallet: () => fetch(`${API_BASE}/blockchain/connect`, {
    method: 'POST'
  }).then(res => res.json()),
  
  storeOnBlockchain: (data) => fetch(`${API_BASE}/blockchain/store`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(res => res.json())
};

// For browser use
if (typeof window !== 'undefined') {
  window.apiService = apiService;
}