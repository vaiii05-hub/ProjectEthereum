// Simple in-memory database for development
let vehicles = [];
let users = [];

const memoryDB = {
  // Vehicle operations
  saveVehicle: (vehicleData) => {
    const vehicle = {
      id: Date.now().toString(),
      ...vehicleData,
      registrationDate: new Date(),
      isVerified: true,
      isFraud: false
    };
    vehicles.push(vehicle);
    return vehicle;
  },

  findVehicleByNumber: (vehicleNumber) => {
    return vehicles.find(v => v.vehicleNumber === vehicleNumber);
  },

  updateVehicle: (vehicleNumber, updateData) => {
    const index = vehicles.findIndex(v => v.vehicleNumber === vehicleNumber);
    if (index !== -1) {
      vehicles[index] = { ...vehicles[index], ...updateData };
      return vehicles[index];
    }
    return null;
  },

  // User operations
  saveUser: (userData) => {
    const user = {
      id: Date.now().toString(),
      ...userData,
      createdAt: new Date(),
      vehicles: []
    };
    users.push(user);
    return user;
  },

  findUserByWallet: (walletAddress) => {
    return users.find(u => u.walletAddress === walletAddress);
  },

  // Get all data (for debugging)
  getAllVehicles: () => vehicles,
  getAllUsers: () => users
};

module.exports = memoryDB;