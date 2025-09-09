const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Use MONGODB_URI which you will set in Render
    const mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) throw new Error("MongoDB URI is not defined");

    const conn = await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
