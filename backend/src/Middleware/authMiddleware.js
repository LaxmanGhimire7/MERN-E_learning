const jwt = require("jsonwebtoken");
const User = require("../Model/userModel");

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization;

    // Check token presence and proper format with space after Bearer
    if (!token || !token.startsWith("Bearer ")) {
      return res.status(401).json({
        status: 401,
        msg: "Unauthorized access: Token is missing or malformed",
      });
    }

    const actualToken = token.split(" ")[1];
    const decodedToken = jwt.verify(actualToken, process.env.secret_key);

    const user = await User.findById(decodedToken.id);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Auth error", error.message);
    return res.status(401).json({ msg: "Invalid or expired token", error: error.message });
  }
};

module.exports = authMiddleware;
