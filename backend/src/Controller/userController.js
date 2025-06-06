const user = require("../Model/userModel");
const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  const { firstName, lastName, userName, email, password } = req.body;
  try {
    const data = await user.findOne({ email, userName });
    if (data) {
      const existingUser = data.email === email ? "email" : "username";
      return res.status(409).json({
        success: false,
        message: `${existingUser} is already registered`,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let response = new user({
      firstName,
      lastName,
      userName,
      email,
      password: hashedPassword,
    });
    response = await response.save();
    return res
      .status(201)
      .json({ msg: "User is register successfully", response });
  } catch (error) {
    return res.json({ msg: "error ", error });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ status: 400, msg: "Required username or email and password" });
    }
    const userDetail = await user.findOne({ email });
    // .select("+password"); incase password ma select rakheko xa vanye
    if (!userDetail) {
      return res.status(404).json({ msg: " user not found" });
    }
    let isMatchedPassword = await bcrypt.compare(password, userDetail.password);
    if (!isMatchedPassword) {
      return res
        .status(404)
        .json({ status: 404, msg: "Username/Email or password is incorrect" });
    }

    // yo chai last login dekhyos vanera...
    userDetail.lastLogin = new Date();
    await userDetail.save();

    const token = jwt.sign({ id: userDetail._id }, process.env.secret_key, {
      expiresIn: "7d",
    });
    return res.status(200).json({
      status: 200,
      msg: "User login successful",
      userDetail,
      token: token,
    });
  } catch (error) {
    res.status(500).json({ status: 500, msg: "Server Error" });
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
      res.status(404).json({ status: 400, msg: "User Not Found" });
    }

    const secret = jwt + existUser.password;
    const token = jwt.sign();
    console.log(secret);
  } catch (error) {}
};

const deleteUser = async (req, res) => {
  let { id } = req.params;
  if (!id) {
    return req.status(400).json({ status: 400, msg: "ID not found" });
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
