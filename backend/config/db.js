const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
      throw new Error("❌ MongoDB URI is not defined in environment variables (MONGO_URI).");
    }

    // Debug log – hide password if present
    const safeUri = mongoUri.replace(/:\/\/.*:.*@/, '://<username>:<password>@');
    console.log("🔍 Using MongoDB URI:", safeUri);

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

