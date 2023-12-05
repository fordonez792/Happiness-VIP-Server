require("dotenv").config();

const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const Admins = require("../models/Admins");
const { authenticateToken } = require("../middleware/AuthMiddleware");

const router = express.Router();

router.post("/create", async (req, res) => {
  const { username, password } = req.body;

  try {
    const admin = await Admins.findOne({ username });

    if (admin) {
      return res
        .json({
          status: "FAILED",
          message: "Admin already exists",
        })
        .status(400);
    }

    const hash = await bcrypt.hash(password, 10);

    const newAdmin = new Admins({ username, password: hash });
    await newAdmin.save();

    res
      .json({
        status: "SUCCESS",
        message: "Admin created successfully",
      })
      .status(200);
  } catch (error) {
    res
      .json({
        status: "FAILED",
        message: "Some error happened while creating admin",
        error,
      })
      .status(500);
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await Admins.findOne({ username });
    if (!user) {
      return res
        .json({
          status: "FAILED",
          message: "No user found",
        })
        .status(400);
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res
        .json({
          status: "FAILED",
          message: "Wrong password",
        })
        .status(400);
    }

    const token = jwt.sign(
      { username: user.username, id: user._id },
      process.env.ACCESS_TOKEN_SECRET
    );
    res.json({
      status: "SUCCESS",
      message: "Admin logged in successfully",
      accessToken: token,
      username: user.username,
      id: user._id,
    });
  } catch (error) {
    res
      .json({
        status: "FAILED",
        message: "Some error happened while logging in",
        error,
      })
      .status(500);
  }
});

// Authenticates token on refresh of the page
router.get("/auth", authenticateToken, async (req, res) => {
  res.json(req.user);
});

module.exports = router;
