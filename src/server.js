const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'], // React/Vite ports
  credentials: true
}));
app.use(express.json());

// Serve static files
app.use(express.static('public'));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/vehicles', require('./routes/vehicles'));
app.use('/api/blockchain', require('./routes/blockchain'));
app.use('/api/rto', require('./routes/rto'));
app.use('/api/contract', require('./routes/contract'));
app.use('/api/verification', require('./routes/verification'));

// Error handling middleware
app.use(require('./middleware/errorHandler'));

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
    code: 'NOT_FOUND'
  });
});

// MongoDB connection (optional - commented out for demo)
// mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/vehicle-verification')
//   .then(() => console.log('MongoDB connected'))
//   .catch(err => {
//     console.warn('MongoDB not available - using in-memory storage');
//   });

console.log('Note: MongoDB disabled - using in-memory storage for demo');

// Graceful shutdown
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  process.exit(1);
});

// Auto find available port
const net = require('net');

function findAvailablePort(startPort = 3000) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.listen(startPort, () => {
      const port = server.address().port;
      server.close(() => resolve(port));
    });
    server.on('error', () => {
      resolve(findAvailablePort(startPort + 1));
    });
  });
}

// Start server with available port
findAvailablePort(3000).then(port => {
  app.listen(port, () => {
    console.log(`✅ Server running on port ${port}`);
    console.log(`🌐 Open: http://localhost:${port}`);
    console.log(`🚀 App is ready to use!`);
  });
});