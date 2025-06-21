const express = require("express");
const router = express.Router();
const authMiddleware = require ("../Middleware/authMiddleware");
const studentMiddleware = require("../Middleware/studentMiddleware");
const {getStudentDashboard} = require("../Controller/studentController");

router.get("/getStudentDashboard",authMiddleware,studentMiddleware, getStudentDashboard);

module.exports = router;