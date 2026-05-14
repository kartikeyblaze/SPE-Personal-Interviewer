const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    console.log(`Attempting to connect to: ${process.env.MONGO_URI}`);
    
    // Modern Mongoose 8+ doesn't need useNewUrlParser or useUnifiedTopology
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000, // 5 second timeout
    });

    mongoose.connection.on('connected', () => {
      console.log('Mongoose default connection open');
    });

    mongoose.connection.on('error', (err) => {
      console.error('Mongoose default connection error:', err);
    });

    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('Initial MongoDB connection error:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
