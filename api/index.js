const app = require('../server/server');
const { connectDB } = require('../server/config/db');

// Vercel Serverless Function entry point
module.exports = async (req, res) => {
  try {
    await connectDB();
  } catch (error) {
    console.error('Database connection error in Vercel function:', error);
  }
  return app(req, res);
};

