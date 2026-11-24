const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/pw_nextstep';

// Connection state tracking for serverless invocations (Vercel Lambda)
let cachedPromise = null;
let lastFailureTime = 0;
const FAILURE_COOLDOWN_MS = 30000; // 30s cooldown before retrying a failed connection

const connectDB = async () => {
  // 1. If connection is already open and ready, reuse it immediately
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  // 2. If a connection recently failed within the cooldown window, return null immediately
  // This allows the in-memory fallback layer to respond instantaneously (<5ms) without hanging
  if (Date.now() - lastFailureTime < FAILURE_COOLDOWN_MS) {
    return null;
  }

  // 3. If a connection attempt is already in-flight, await the same promise
  // This prevents multiple concurrent serverless invocations from opening redundant connection pools
  if (cachedPromise) {
    return cachedPromise;
  }

  // 4. Configure production-aware connection options
  const isProduction = process.env.NODE_ENV === 'production';
  const connectionOptions = {
    // 5s timeout in production prevents serverless functions from exceeding Lambda execution limits
    serverSelectionTimeoutMS: isProduction ? 5000 : 10000,
    // Disable autoIndex in production to avoid schema re-indexing overhead on cold starts
    autoIndex: !isProduction,
    maxPoolSize: 10,
    socketTimeoutMS: 45000,
  };

  cachedPromise = mongoose.connect(MONGODB_URI, connectionOptions)
    .then((conn) => {
      lastFailureTime = 0;
      console.log(`✅ MongoDB Atlas Connected: ${conn.connection.host} / Database: ${conn.connection.name}`);
      return conn;
    })
    .catch((error) => {
      lastFailureTime = Date.now();
      console.error('❌ MongoDB Connection Failed:', error.message);
      console.log('⚠️ Running with local in-memory fallback layer.');
      // Reset cachedPromise on failure so future invocations after cooldown can re-attempt
      cachedPromise = null;
      return null;
    });

  return cachedPromise;
};

module.exports = { connectDB, mongoose };
