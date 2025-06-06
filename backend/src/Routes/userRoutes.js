const {
  register,
  login,
  getUser,
  getAllUser,
  forgotPassword,
  deleteUser,
  editUser,
} = require("../Controller/userController");
const express = require("express");
const router = express.Router();
const authMiddleware = require("../Middleware/authMiddleware");
const upload = require("../Middleware/upload")

router.post("/register", register);
router.post("/login", login);
router.post("/forgotPassword", authMiddleware, forgotPassword);
router.get("/getUser", authMiddleware, getUser);
router.get("/getAllUser", authMiddleware, getAllUser);
router.put("/editUser", upload.single("image"), authMiddleware, editUser);
router.delete("/deleteUser/:id", authMiddleware, deleteUser);

module.exports = router;
