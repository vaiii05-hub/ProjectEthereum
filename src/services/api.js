const API_BASE_URL = 'http://localhost:3001/api';

// Register vehicle
export const registerVehicle = async (vehicleData) => {
  const response = await fetch(`${API_BASE_URL}/vehicles/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(vehicleData),
  });
  return response.json();
};

// Verify vehicle
export const verifyVehicle = async (vehicleNumber) => {
  const response = await fetch(`${API_BASE_URL}/vehicles/verify/${vehicleNumber}`);
  return response.json();
};

// Register user
export const registerUser = async (userData) => {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });
  return response.json();
};