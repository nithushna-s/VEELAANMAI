const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const { secretKey } = require("../config");
const bcrypt = require("bcrypt");

const signup = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ error: "User already registered" });
    }

    const user = new User({
      firstName,
      lastName,
      email,
      password,
      role: "user", 
    });
    await user.save();

    // Create JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role }, 
      secretKey,
      { expiresIn: "1h" }
    );

    // Set token as a cookie
    res.cookie("token", token, {  maxAge: 3600000 });

    res.json({ message: "Signup successful", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};


const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role }, // Include role in token
      secretKey,
      { expiresIn: "1h" }
    );

    res.cookie("token", token, { httpOnly: true, maxAge: 3600000 , secure:process.env.NODE_ENV !== "development",
    sameSite:"None",});

    res.json({
      token,
      role: user.role, // Send role in response
      message: user.role === "admin" ? "Admin login successful" : "User login successful",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};


const logout = async (req, res) => {
  try {
    res.clearCookie("token");
    res.json({ message: "Logout successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { signup, login, logout };
