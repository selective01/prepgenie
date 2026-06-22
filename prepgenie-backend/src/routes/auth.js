const express  = require("express");
const jwt      = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const User     = require("../models/User");
const { protect } = require("../middleware/auth");

const router = express.Router();

function signToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
}

function sendToken(user, statusCode, res) {
  const token = signToken(user._id);
  res.status(statusCode).json({
    success: true,
    token,
    user: {
      id:               user._id,
      name:             user.name,
      email:            user.email,
      plan:             user.plan,
      subjects:         user.subjects,
      examDate:         user.examDate,
      targetScore:      user.targetScore,
      studyHoursPerDay: user.studyHoursPerDay,
    },
  });
}

// POST /api/auth/register
router.post("/register",
  [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Please enter a valid email"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: errors.array()[0].msg });
    }
    const { name, email, password } = req.body;
    try {
      const existing = await User.findOne({ email });
      if (existing) {
        return res.status(400).json({ success: false, message: "An account with this email already exists." });
      }
      const user = await User.create({ name, email, password });
      sendToken(user, 201, res);
    } catch (err) {
      console.error("Register error:", err.message);
      res.status(500).json({ success: false, message: "Server error. Please try again." });
    }
  }
);

// POST /api/auth/login
router.post("/login",
  [
    body("email").isEmail().withMessage("Please enter a valid email"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: errors.array()[0].msg });
    }
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email }).select("+password");
      if (!user || !(await user.matchPassword(password))) {
        return res.status(401).json({ success: false, message: "Invalid email or password." });
      }
      sendToken(user, 200, res);
    } catch (err) {
      console.error("Login error:", err.message);
      res.status(500).json({ success: false, message: "Server error. Please try again." });
    }
  }
);

// GET /api/auth/me
router.get("/me", protect, async (req, res) => {
  res.status(200).json({
    success: true,
    user: {
      id:               req.user._id,
      name:             req.user.name,
      email:            req.user.email,
      plan:             req.user.plan,
      subjects:         req.user.subjects,
      examDate:         req.user.examDate,
      targetScore:      req.user.targetScore,
      studyHoursPerDay: req.user.studyHoursPerDay,
      createdAt:        req.user.createdAt,
    },
  });
});

// PUT /api/auth/update
router.put("/update", protect, async (req, res) => {
  const allowed = ["name", "subjects", "examDate", "targetScore", "studyHoursPerDay"];
  const updates = {};
  allowed.forEach((field) => {
    if (req.body[field] !== undefined) updates[field] = req.body[field];
  });
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true, runValidators: true }
    );
    res.status(200).json({
      success: true,
      user: {
        id:               user._id,
        name:             user.name,
        email:            user.email,
        plan:             user.plan,
        subjects:         user.subjects,
        examDate:         user.examDate,
        targetScore:      user.targetScore,
        studyHoursPerDay: user.studyHoursPerDay,
      },
    });
  } catch (err) {
    console.error("Update error:", err.message);
    res.status(500).json({ success: false, message: "Server error. Please try again." });
  }
});

module.exports = router;