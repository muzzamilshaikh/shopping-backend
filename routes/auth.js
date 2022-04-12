const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

//register
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  const newUser = new User({
    username,
    email,
    password: CryptoJS.AES.encrypt(password, process.env.PASS_SEC).toString(),
  });
  try {
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

//login
router.post("/login", async (req, res) => {
  const { username } = req.body;
  try {
    const user = await User.findOne({ username });
    !user && res.status(401).json("username is incorrect");
    const hashPassword = CryptoJS.AES.decrypt(
      user.password,
      process.env.PASS_SEC
    );
    const password = hashPassword.toString(CryptoJS.enc.Utf8);
    password !== req.body.password &&
      res.status(401).json("password is incorrect");
    const accessToken = jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_SEC,
      { expiresIn: "3d" }
    );
    const { password: userPass, ...other } = user._doc;

    res.status(200).json({ ...other, accessToken });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
