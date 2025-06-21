const express = require("express");
const router = express.Router();
const authMiddleware = require ("../Middleware/authMiddleware")
const {getStudentDashboard} = require("../Controller/studentController");

router.get("/getStudentDashboard",authMiddleware, getStudentDashboard);

module.exports = router;