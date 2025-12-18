// In-memory storage for demo purposes
class MemoryStorage {
  constructor() {
    this.vehicles = new Map();
    this.users = new Map();
  }

  // Vehicle operations
  async saveVehicle(vehicleData) {
    const id = Date.now().toString();
    const vehicle = {
      _id: id,
      ...vehicleData,
      createdAt: new Date()
    };
    this.vehicles.set(vehicleData.vehicleNumber, vehicle);
    return vehicle;
  }

  async findVehicle(vehicleNumber) {
    return this.vehicles.get(vehicleNumber) || null;
  }

  async getAllVehicles() {
    return Array.from(this.vehicles.values());
  }

  // User operations
  async saveUser(userData) {
    const id = Date.now().toString();
    const user = {
      _id: id,
      ...userData,
      createdAt: new Date()
    };
    this.users.set(userData.email, user);
    return user;
  }

  async findUser(email) {
    return this.users.get(email) || null;
  }
}

module.exports = new MemoryStorage();