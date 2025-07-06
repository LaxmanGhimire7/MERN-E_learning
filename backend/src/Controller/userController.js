const user = require("../Model/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const register = async (req, res) => {
  let { firstName, lastName, userName, email, password } = req.body;

  email = email.toLowerCase().trim();

  try {
    const existingUser = await user.findOne({ 
      $or: [{ email }, { userName }] 
    });

    if (existingUser) {
      if (existingUser.email === email) {
        return res.status(409).json({
          success: false,
          message: "Email is already registered",
        });
      } else {
        return res.status(409).json({
          success: false,
          message: "Username is already taken",
        });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let newUser = new user({
      firstName,
      lastName,
      userName,
      email,
      password: hashedPassword,
    });

    newUser = await newUser.save();

    return res.status(201).json({ msg: "User registered successfully", newUser });
  } catch (error) {
    return res.status(500).json({ msg: "Server error", error });
  }
};


const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ msg: "Email and password are required" });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const userDetail = await user.findOne({ email: normalizedEmail });
    console.log("Login attempt for:", normalizedEmail);
    if (!userDetail) {
      console.log("User not found");
      return res.status(401).json({ msg: "Email or password is incorrect" });
    }

    const isMatchedPassword = await bcrypt.compare(password, userDetail.password);
    if (!isMatchedPassword) {
      console.log("Password mismatch");
      return res.status(401).json({ msg: "Email or password is incorrect" });
    }

    await user.updateOne(
  { _id: userDetail._id },
  { $set: { lastLogin: new Date() } }
);


    const token = jwt.sign({ id: userDetail._id }, process.env.secret_key, {
      expiresIn: "7d",
    });

    return res.status(200).json({
      msg: "User login successful",
      userDetail,
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ msg: "Server error" });
  }
};


const getUser = (req, res) => {
  res.status(200).json({ status: 200, msg: "user found", user: req.user });
};

const getAllUser = async (req, res) => {
  try {
    let userDetail = await user.find({});
    if (!userDetail) {
      res.status(404).json({ status: 404, msg: "User not found" });
    }
    res.status(200).json({ status: 200, msg: "user found", user: userDetail });
  } catch (error) {
    res.status(500).json({ status: 500, msg: "Server Error" });
  }
};

const editUser = async (req, res) => {
  try {
    const users = req.user;
    const image = req.file?.filename || "default";

    const { firstName, lastName, userName, phone, email } = req.body;

    let response = await user.findByIdAndUpdate(
      users._id,
      {
        firstName,
        lastName,
        phone,
        userName,
        email,
        image,
      },
      { new: true }
    );

    res.status(200).json({
      status: 200,
      msg: "User updated successfully",
      response: response,
    });
  } catch (error) {
    res.status(500).json({ status: 500, msg: "Server Error", error });
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const existUser = await user.findOne({ email });

    if (!existUser) {
      return res.status(404).json({ status: 404, msg: "User not found" });
    }

    const secret = process.env.secret_key + existUser.password;
    const token = jwt.sign({ id: existUser._id }, secret, { expiresIn: "15m" });

    const resetLink = `http://localhost:3000/reset-password/${existUser._id}/${token}`;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"LMS Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Password Reset Request",
      html: `
        <p>Hello ${existUser.firstName},</p>
        <p>You requested a password reset. Click the link below to reset your password:</p>
        <a href="${resetLink}" style="color: blue;">Reset Password</a>
        <p>This link will expire in 15 minutes.</p>
        <p>If you didn’t request this, you can ignore this email.</p>
      `,
    });

    res.status(200).json({ status: 200, msg: "Reset link sent to email." });
  } catch (error) {
    console.error("Error in forgot password:", error);
    res.status(500).json({ status: 500, msg: "Server Error", error });
  }
};



const deleteUser = async (req, res) => {
  let { id } = req.params;
  if (!id) {
    return res.status(400).json({ status: 400, msg: "ID not found" });
  }
  let response = await user.findByIdAndDelete({ _id: id });
  res.status(200).json({ status: 200, msg: "User is Deleted", response });
};

module.exports = {
  register,
  login,
  getUser,
  getAllUser,
  forgotPassword,
  deleteUser,
  editUser,
};
