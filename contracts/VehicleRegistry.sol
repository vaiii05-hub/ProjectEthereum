// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract VehicleRegistry {
    struct Vehicle {
        string vehicleNumber;
        string make;
        string model;
        uint256 year;
        address currentOwner;
        bool isRegistered;
        bool isFraud;
        uint256 registrationTime;
    }

    mapping(string => Vehicle) public vehicles;
    mapping(string => address[]) public ownershipHistory;
    
    event VehicleRegistered(string vehicleNumber, address owner, uint256 timestamp);
    event OwnershipTransferred(string vehicleNumber, address from, address to, uint256 timestamp);
    event FraudReported(string vehicleNumber, uint256 timestamp);

    function registerVehicle(
        string memory _vehicleNumber,
        string memory _make,
        string memory _model,
        uint256 _year
    ) public {
        require(!vehicles[_vehicleNumber].isRegistered, "Vehicle already registered");
        
        vehicles[_vehicleNumber] = Vehicle({
            vehicleNumber: _vehicleNumber,
            make: _make,
            model: _model,
            year: _year,
            currentOwner: msg.sender,
            isRegistered: true,
            isFraud: false,
            registrationTime: block.timestamp
        });
        
        ownershipHistory[_vehicleNumber].push(msg.sender);
        emit VehicleRegistered(_vehicleNumber, msg.sender, block.timestamp);
    }

    function transferOwnership(string memory _vehicleNumber, address _newOwner) public {
        require(vehicles[_vehicleNumber].isRegistered, "Vehicle not registered");
        require(vehicles[_vehicleNumber].currentOwner == msg.sender, "Not the owner");
        require(_newOwner != address(0), "Invalid address");
        
        address previousOwner = vehicles[_vehicleNumber].currentOwner;
        vehicles[_vehicleNumber].currentOwner = _newOwner;
        ownershipHistory[_vehicleNumber].push(_newOwner);
        
        emit OwnershipTransferred(_vehicleNumber, previousOwner, _newOwner, block.timestamp);
    }

    function verifyVehicle(string memory _vehicleNumber) public view returns (
        string memory make,
        string memory model,
        uint256 year,
        address owner,
        bool isRegistered,
        bool isFraud
    ) {
        Vehicle memory v = vehicles[_vehicleNumber];
        return (v.make, v.model, v.year, v.currentOwner, v.isRegistered, v.isFraud);
    }

    function reportFraud(string memory _vehicleNumber) public {
        require(vehicles[_vehicleNumber].isRegistered, "Vehicle not registered");
        vehicles[_vehicleNumber].isFraud = true;
        emit FraudReported(_vehicleNumber, block.timestamp);
    }

    function getOwnershipHistory(string memory _vehicleNumber) public view returns (address[] memory) {
        return ownershipHistory[_vehicleNumber];
    }
}