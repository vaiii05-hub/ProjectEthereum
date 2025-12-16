// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;
contract VehicleAuthenctication {

    //to update about vehicle status
    enum Status {
        NOT_REGISTERED,
        REGISTERED
    }

    //storing vehicle information
    struct VehicleData {
        string buyerName;
        string buyerId;
        string ownerName;
        string vehicleNumber;
        address registeredBy; 
        Status status;        
    }

    //to store all vehicle data
    mapping(string => VehicleData) public vehicleRecords;

    // event to update frontend
    event VehicleRegistered(
        string vehicleNumber,
        string ownerName,
        string buyerName,
        address registeredBy
    );

    //function to register the vehicle
    function registerVehicle(
        string memory _buyerName,
        string memory _buyerId,
        string memory _ownerName,
        string memory _vehicleNumber
    ) public {

        
        require(bytes(_vehicleNumber).length > 0, "Enter vehicle number");
        require(bytes(_ownerName).length > 0, "Enter owner name");

    
        require(
            vehicleRecords[_vehicleNumber].status == Status.NOT_REGISTERED,
            "Vehicle already registered"
        );

        // to store new data
        vehicleRecords[_vehicleNumber] = VehicleData(
            _buyerName,
            _buyerId,                                
            _ownerName,
            _vehicleNumber,
            msg.sender,
            Status.REGISTERED
        );

        // sending message to UI
        emit VehicleRegistered(
            _vehicleNumber,
            _ownerName,
            _buyerName,
            msg.sender
        );
    }

    //function to verify vehicle
    function verifyVehicle(string memory _vehicleNumber)
        public
        view
        returns (
            string memory buyerName,
            string memory buyerId,
            string memory ownerName,
            string memory vehicleNumber,
            address registeredBy,
            Status vehicleStatus
        )
    {
        VehicleData memory data = vehicleRecords[_vehicleNumber];

        return (
            data.buyerName,
            data.buyerId,
            data.ownerName,
            data.vehicleNumber,
            data.registeredBy,
            data.status
        );
    }
}
