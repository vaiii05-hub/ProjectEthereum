const axios = require('axios');

class RTOService {
  constructor() {
    // RTO API endpoints (these are example URLs - replace with actual RTO APIs)
    this.rtoApiBase = 'https://vahan-api.gov.in/api/v1';
    this.apiKey = process.env.RTO_API_KEY || 'demo_key';
  }

  // Verify vehicle with RTO database
  async verifyVehicleWithRTO(vehicleNumber) {
    try {
      // Clean vehicle number format
      const cleanVehicleNumber = vehicleNumber.replace(/\s+/g, '').toUpperCase();
      
      // Mock RTO API response (replace with actual API call)
      const mockRTOData = this.getMockRTOData(cleanVehicleNumber);
      
      // Actual API call would be:
      // const response = await axios.get(`${this.rtoApiBase}/vehicle/${cleanVehicleNumber}`, {
      //   headers: { 'Authorization': `Bearer ${this.apiKey}` }
      // });
      
      return {
        success: true,
        data: mockRTOData,
        source: 'RTO_DATABASE'
      };
    } catch (error) {
      console.error('RTO API Error:', error.message);
      return {
        success: false,
        error: 'RTO verification failed',
        details: error.message
      };
    }
  }

  // Get owner history from RTO
  async getOwnerHistory(vehicleNumber) {
    try {
      const cleanVehicleNumber = vehicleNumber.replace(/\s+/g, '').toUpperCase();
      
      // Mock owner history data
      const mockHistory = this.getMockOwnerHistory(cleanVehicleNumber);
      
      return {
        success: true,
        data: mockHistory,
        source: 'RTO_DATABASE'
      };
    } catch (error) {
      return {
        success: false,
        error: 'Owner history fetch failed',
        details: error.message
      };
    }
  }

  // Check if vehicle is stolen/blacklisted
  async checkVehicleStatus(vehicleNumber) {
    try {
      const cleanVehicleNumber = vehicleNumber.replace(/\s+/g, '').toUpperCase();
      
      // Mock status check
      const mockStatus = this.getMockVehicleStatus(cleanVehicleNumber);
      
      return {
        success: true,
        data: mockStatus,
        source: 'RTO_DATABASE'
      };
    } catch (error) {
      return {
        success: false,
        error: 'Status check failed',
        details: error.message
      };
    }
  }

  // Mock RTO data generator (replace with actual API)
  getMockRTOData(vehicleNumber) {
    const mockData = {
      'MH12AB1234': {
        vehicleNumber: 'MH12AB1234',
        registrationDate: '2020-03-15',
        make: 'MARUTI SUZUKI',
        model: 'SWIFT DZIRE',
        variant: 'VDI',
        year: 2020,
        engineNumber: 'K15B12345678',
        chassisNumber: 'MA3ERLF1S00123456',
        fuelType: 'DIESEL',
        currentOwner: {
          name: 'RAHUL SHARMA',
          fatherName: 'SURESH SHARMA',
          address: 'PUNE, MAHARASHTRA',
          pincode: '411001'
        },
        rtoOffice: 'MH12 - PUNE',
        fitnessUpto: '2025-03-15',
        insuranceUpto: '2024-03-15',
        pucUpto: '2024-06-15',
        status: 'ACTIVE',
        isStolen: false,
        isBlacklisted: false
      }
    };

    return mockData[vehicleNumber] || {
      vehicleNumber,
      error: 'Vehicle not found in RTO database',
      status: 'NOT_FOUND'
    };
  }

  getMockOwnerHistory(vehicleNumber) {
    return [
      {
        ownerName: 'RAHUL SHARMA',
        fromDate: '2020-03-15',
        toDate: null, // Current owner
        transferType: 'FIRST_REGISTRATION'
      },
      {
        ownerName: 'AMIT KUMAR',
        fromDate: '2018-01-10',
        toDate: '2020-03-14',
        transferType: 'SALE'
      }
    ];
  }

  getMockVehicleStatus(vehicleNumber) {
    return {
      vehicleNumber,
      isStolen: false,
      isBlacklisted: false,
      hasLoan: false,
      isHypothecated: false,
      status: 'CLEAR',
      lastUpdated: new Date().toISOString()
    };
  }
}

module.exports = new RTOService();