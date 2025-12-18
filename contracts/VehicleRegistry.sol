// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract VehicleRegistry {
    struct Vehicle {
        string vehicleNumber;
        address owner;
        uint256 timestamp;
        bool exists;
    }
    
    mapping(string => Vehicle) public vehicles;
    mapping(address => string[]) public ownerVehicles;
    
    event VehicleRegistered(string vehicleNumber, address owner, uint256 timestamp);
    
    function registerVehicle(string memory _vehicleNumber) public {
        require(!vehicles[_vehicleNumber].exists, "Vehicle already registered");
        
        vehicles[_vehicleNumber] = Vehicle({
            vehicleNumber: _vehicleNumber,
            owner: msg.sender,
            timestamp: block.timestamp,
            exists: true
        });
        
        ownerVehicles[msg.sender].push(_vehicleNumber);
        
        emit VehicleRegistered(_vehicleNumber, msg.sender, block.timestamp);
    }
    
    function verifyVehicle(string memory _vehicleNumber) public view returns (bool, address, uint256) {
        Vehicle memory vehicle = vehicles[_vehicleNumber];
        return (vehicle.exists, vehicle.owner, vehicle.timestamp);
    }
    
    function getOwnerVehicles(address _owner) public view returns (string[] memory) {
        return ownerVehicles[_owner];
    }
}