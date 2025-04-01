const User = require("../models/User.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { use } = require("passport");
module.exports.rednderSignUp = (req, res) => {
  res.render("users/signup.ejs");
};

module.exports.signup = async (req, res) => {
  const { username, password, email } = req.body;
  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });
    const savedUser = await newUser.save();
    const token = jwt.sign({ id: savedUser._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "1h",
    });

    res.status(201).json({ token, userId: savedUser._id });
  } catch (err) {
    console.error("Error during signup: ", err.message);
    res.status(500).send("Server error");
  }
};
module.exports.renderLogin = (req, res) => {
  res.render("users/login.ejs");
};
module.exports.fetchUser = (req, res) => {
  const {userId}=req.params;
  try {
    User.findById(userId).populate("wishlist").then((user) => {
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json({ user });
    });
  }
  catch (err) {
    console.error("Error fetching user: ", err.message);
    res.status(500).send("Server error");
  }
};
module.exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "1h",
    });

    res.json({ token, userId: user._id, user: user });
  } catch (err) {
    console.error("Error during login:", err.message);
    res.status(500).send("Server error");
  }
};
module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "Logged out successfully");
    res.redirect("/listing");
  });
};
