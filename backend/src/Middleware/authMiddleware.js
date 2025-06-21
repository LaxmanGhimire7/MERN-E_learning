const jwt = require("jsonwebtoken");
const User = require("../Model/userModel");

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    // console.log(token)
    if (!token) {
      return res.status(401).json({
        status: 401,
        msg: "Unauthorized access: Token is missing or invalid",
      });
    }
    const response = token.split(" ")[1];
    const decodedToken = jwt.verify(response, process.env.secret_key);

    let data = await User.findOne({ _id: decodedToken.id });

    
    req.user = data;
    next();
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error });
    console.log("Auth error",error)
  }
};

module.exports = authMiddleware;
