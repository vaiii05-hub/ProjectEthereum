const express = require('express');
const axios = require('axios');
const router = express.Router();

// RTO Vehicle Details API
router.get('/vehicle/:vehicleNumber', async (req, res) => {
  try {
    const { vehicleNumber } = req.params;
    
    // Mock RTO API call (replace with real RTO API)
    const rtoResponse = await mockRTOAPI(vehicleNumber);
    
    res.json({
      success: true,
      rtoData: rtoResponse,
      vehicleNumber
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'RTO verification failed',
      message: error.message 
    });
  }
});

// Mock RTO Database
const mockRTODatabase = {
  "MH12AB1234": {
    vehicleNumber: "MH12AB1234",
    ownerName: "राज शर्मा",
    registrationDate: "2020-05-15",
    engineNumber: "ENG123456789",
    chassisNumber: "CHS987654321",
    fuelType: "Petrol",
    vehicleClass: "Motor Car",
    makerModel: "Maruti Suzuki Swift",
    registrationAuthority: "MH-12 Mumbai",
    fitnessUpto: "2025-05-14",
    insuranceUpto: "2024-12-31",
    pucUpto: "2024-06-30",
    status: "Active",
    verified: true
  },
  "DL01CA9999": {
    vehicleNumber: "DL01CA9999",
    ownerName: "अमित कुमार",
    registrationDate: "2019-03-20",
    engineNumber: "ENG987654321",
    chassisNumber: "CHS123456789",
    fuelType: "Diesel",
    vehicleClass: "Motor Car",
    makerModel: "Hyundai Creta",
    registrationAuthority: "DL-01 Delhi",
    fitnessUpto: "2024-03-19",
    insuranceUpto: "2024-08-15",
    pucUpto: "2024-09-20",
    status: "Active",
    verified: true
  },
  "KA03HB5678": {
    vehicleNumber: "KA03HB5678",
    ownerName: "प्रिया नायर",
    registrationDate: "2021-07-10",
    engineNumber: "ENG555666777",
    chassisNumber: "CHS777888999",
    fuelType: "Petrol",
    vehicleClass: "Motor Car",
    makerModel: "Honda City",
    registrationAuthority: "KA-03 Bangalore",
    fitnessUpto: "2026-07-09",
    insuranceUpto: "2025-01-10",
    pucUpto: "2024-12-10",
    status: "Active",
    verified: true
  },
  "TEST001": {
    vehicleNumber: "TEST001",
    ownerName: "टेस्ट ओनर",
    registrationDate: "2022-01-01",
    engineNumber: "TESTENG001",
    chassisNumber: "TESTCHS001",
    fuelType: "Electric",
    vehicleClass: "Motor Car",
    makerModel: "Tata Nexon EV",
    registrationAuthority: "MH-12 Mumbai",
    fitnessUpto: "2027-01-01",
    insuranceUpto: "2025-01-01",
    pucUpto: "2025-01-01",
    status: "Active",
    verified: true
  }
};

// Mock RTO API function
async function mockRTOAPI(vehicleNumber) {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Check if vehicle exists in mock database
  const vehicleData = mockRTODatabase[vehicleNumber.toUpperCase()];
  
  if (!vehicleData) {
    throw new Error('Vehicle not found in RTO records');
  }
  
  return vehicleData;
}

// Real RTO API integration (uncomment when you have API key)
/*
async function realRTOAPI(vehicleNumber) {
  const apiKey = process.env.RTO_API_KEY;
  const apiUrl = `https://rto-vehicle-info.p.rapidapi.com/getVehicleInfo`;
  
  const response = await axios.get(apiUrl, {
    params: { vehicleNumber },
    headers: {
      'X-RapidAPI-Key': apiKey,
      'X-RapidAPI-Host': 'rto-vehicle-info.p.rapidapi.com'
    }
  });
  
  return response.data;
}
*/

module.exports = router;