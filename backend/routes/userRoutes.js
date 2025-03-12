const express = require("express");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", async (req, res) => {
  const {name, email, password} = req.body;
  try {
    let user = await User.findOne({email});
    if (user) return res.status(400).json({message: "User already exists"});

    user = new User({name, email, password});
    await user.save();

    // create JWT payload
    const payload = {user: {id: user._id, role: user.role}};

    // sign and return the token along with user data
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      {expiresIn: "40h"},
      (err, token) => {
        if (err) throw err;

        res.status(201).json({
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
          token,
        });
      }
    );
  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error");
  }
});

router.post("/login", async (req, res) => {
 const { email, password } = req.body;
 try {
  let user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "Invalid Credentials" });

  const isMatch = await user.matchPassword(password);
  if (!isMatch) return res.status(400).json({message: "Invalid Credentials"});

  const payload = {user: {id: user._id, role: user.role}};

  // sign and return the token along with user data
  jwt.sign(
    payload,
    process.env.JWT_SECRET,
    {expiresIn: "40h"},
    (err, token) => {
      if (err) throw err;

      res.json({
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token,
      });
    }
  );
  
 } catch (error) {
  console.log(error);
  res.status(500).send("Server Error");
 }
 
});

router.get("/profile", protect, async (req, res) => {
 res.json(req.user);
});

router.post("/check-email", async (req, res) => {
  const {email} = req.body;

  try {
    const user = await User.findOne({email});

    if (!user) {
      return res.status(404).json({message: "This email is not registered."});
    }

    res.status(200).json({message: "Email found."});
  } catch (error) {
    console.error("Error checking email:", error);
    res.status(500).json({message: "Server error. Please try again later."});
  }
});

router.post("/reset-password", async (req, res) => {
  const {email, password} = req.body; // Extract email and the new password

  try {
    // Find the user by email
    const user = await User.findOne({email});
    if (!user) {
      return res.status(404).json({message: "User not found."});
    }

    // Update the user's password (triggering the hash middleware)
    user.password = password; // The hashing happens automatically due to `pre("save")` middleware
    await user.save();

    res.status(200).json({message: "Password updated successfully!"});
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({message: "Server error. Please try again later."});
  }
});



module.exports = router;
