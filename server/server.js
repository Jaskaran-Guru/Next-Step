const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const { connectDB } = require('./config/db');

// Import routes
const authRoutes = require('./routes/auth.routes');
const batchesRoutes = require('./routes/batches.routes');
const lecturesRoutes = require('./routes/lectures.routes');
const dppRoutes = require('./routes/dpp.routes');
const testsRoutes = require('./routes/tests.routes');
const doubtsRoutes = require('./routes/doubts.routes');
const materialsRoutes = require('./routes/materials.routes');
const analyticsRoutes = require('./routes/analytics.routes');
const stagesRoutes = require('./routes/stages.routes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend assets
const publicDirectory = path.join(__dirname, '..', 'public');
app.use(express.static(publicDirectory));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/batches', batchesRoutes);
app.use('/api/lectures', lecturesRoutes);
app.use('/api/dpp', dppRoutes);
app.use('/api/tests', testsRoutes);
app.use('/api/doubts', doubtsRoutes);
app.use('/api/materials', materialsRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/stages', stagesRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    platform: 'NextStep (Physics Wallah Clone)',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Single Page Application route fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(publicDirectory, 'index.html'));
});

// Start Server (only when run directly, e.g. locally or on Render/VPS)
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`=======================================================`);
      console.log(`🚀 NextStep PW Platform Running at: http://localhost:${PORT}`);
      console.log(`📡 MongoDB Atlas: CONNECTED`);
      console.log(`=======================================================`);
    });
  } catch (error) {
    console.error('Server boot failed:', error);
  }
};

if (require.main === module) {
  startServer();
}

module.exports = app;
