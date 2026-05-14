const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("./User");
const connectDB = require("./db");
require("dotenv").config();

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());

// Diagnostic Logger
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`, req.body);
  next();
});

// Health Check
app.get("/api/auth/health", (req, res) => {
  res.json({ status: "ok", service: "auth-service", db: mongoose.connection.readyState === 1 ? "connected" : "disconnected" });
});

app.get("/api/auth/ready", (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ status: "not_ready", service: "auth-service", db: "disconnected" });
  }

  res.json({ status: "ready", service: "auth-service", db: "connected" });
});

app.post("/api/auth/register", async (req, res) => {
  const { email, username, password } = req.body;
  
  if (!email || !username || !password) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    console.log(`[Register] Checking if user exists: ${email}`);
    const existingUser = await User.findOne({ email });
    console.log(`[Register] User exists check complete.`);

    if (existingUser) return res.status(400).json({ message: "User already exists" });

    console.log(`[Register] Hashing password...`);
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log(`[Register] Hashing complete.`);

    const newUser = new User({ email, username, password: hashedPassword });
    console.log(`[Register] Saving user to DB...`);
    await newUser.save();
    console.log(`[Register] User saved successfully.`);

    res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Server error during registration", error: error.message });
  }
});

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  try {
    console.log(`[Login] Finding user: ${email}`);
    const user = await User.findOne({ email });
    console.log(`[Login] User find complete.`);

    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    console.log(`[Login] Verifying password...`);
    const isMatch = await bcrypt.compare(password, user.password);
    console.log(`[Login] Password verification complete: ${isMatch}`);

    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const secret = process.env.JWT_SECRET || "default_scholar_secret_123";
    const token = jwt.sign({ email: user.email }, secret, { expiresIn: "1h" });
    console.log(`[Login] JWT Token generated.`);

    res.json({ body: token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error during login", error: error.message });
  }
});

const PORT = process.env.PORT || 5001;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Auth Service running on port ${PORT}`));
}).catch(err => {
  console.error("Failed to start Auth Service:", err);
  process.exit(1);
});
