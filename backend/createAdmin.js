const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const User = require("./models/user"); // adjust path

const MONGO_URI = process.env.MONGO_URI;

async function createAdmin() {
  await mongoose.connect(MONGO_URI);

  let admin = await User.findOne({ email: "admin@example.com" });
  if (admin) {
    console.log("⚠️ Admin already exists:", admin.email);
    return;
  }

  const hashedPassword = await bcrypt.hash("Admin123!", 10);

  admin = new User({
    name: "Admin",
    email: "admin@example.com",
    password: hashedPassword,
    role: "admin",
  });

  await admin.save();
  console.log("✅ Admin user created:", admin.email);

  process.exit(0);
}

createAdmin().catch(err => {
  console.error("❌ Error creating admin:", err);
  process.exit(1);
});
