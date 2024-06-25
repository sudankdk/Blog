const express = require("express");
const router = express.Router();
const User = require("../models/user");

// Render signin page
router.get("/signin", (req, res) => {
  return res.render("signin");
});

// Render signup page
router.get("/signup", (req, res) => {
  return res.render("signup");
});

// Handle signin
router.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .render("signin", { error: "All fields are required." });
  }

  try {
    const user = await User.matchPassword(email, password);
    if (user) {
      return res.redirect("/");
    } else {
      return res
        .status(400)
        .render("signin", { error: "Invalid email or password." });
    }
  } catch (error) {
    console.error("Error during signin:", error);
    return res
      .status(500)
      .render("signin", { error: "Internal server error." });
  }
});

// Handle signup
router.post("/signup", async (req, res) => {
  const { fullname, email, password } = req.body;

  if (!fullname || !email || !password) {
    return res
      .status(400)
      .render("signup", { error: "All fields are required." });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .render("signup", { error: "Email already exists." });
    }

    await User.create({
      fullname,
      email,
      password,
    });

    return res.redirect("/user/signin");
  } catch (error) {
    console.error("Error during signup:", error);
    return res
      .status(500)
      .render("signup", { error: "Internal server error." });
  }
});

module.exports = router;
