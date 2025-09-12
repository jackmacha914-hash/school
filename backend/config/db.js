const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
      throw new Error("❌ MongoDB URI is not defined in environment variables (MONGO_URI).");
    }

    // Debug log: show exactly what's coming from Render (with quotes/spaces if any)
    console.log("🔍 Raw MONGO_URI =", JSON.stringify(mongoUri));

    // Mask password before logging the URI
    const safeUri = mongoUri.replace(/:\/\/.*:.*@/, '://<username>:<password>@');
    console.log("🔍 Using M
