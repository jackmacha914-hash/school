const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Match the env variable in your .env file
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) throw new Error("MongoDB URI is not defined in .env");

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
