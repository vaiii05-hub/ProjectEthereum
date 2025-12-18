# Vehicle Verification Backend

Backend API for Second-Hand Vehicle Authentication System using blockchain technology.

## Features

- Vehicle registration and verification
- Ownership transfer tracking
- Blockchain integration with Ethereum
- MongoDB database for off-chain data
- RESTful API endpoints

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Update environment variables in `.env`

4. Start MongoDB service

5. Run the server:
```bash
npm run dev
```

## API Endpoints

### Vehicles
- `POST /api/vehicles/register` - Register new vehicle
- `GET /api/vehicles/verify/:vehicleNumber` - Verify vehicle
- `PUT /api/vehicles/transfer/:vehicleNumber` - Transfer ownership

### Authentication
- `POST /api/auth/register` - Register user
- `GET /api/auth/user/:walletAddress` - Get user details

## Database Schema

### Vehicle
- vehicleNumber (unique)
- make, model, year
- currentOwner (name, walletAddress)
- previousOwners array
- blockchainHash
- verification status

### User
- name, email
- walletAddress (unique)
- vehicles array (references)