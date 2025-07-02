const express = require("express");
const router = express.Router();

const {createCourseOrder,getEnrollmentCount, getUserOrder, success, getOrder}= require("../Controller/courseOrderController");
const authMiddleware = require("../Middleware/authMiddleware");

router.post("/createCourseOrder", authMiddleware, createCourseOrder);
router.get("/getUserOrder", authMiddleware, getUserOrder)
router.get("/success", success);
router.get("/getOrder/:id", getOrder);
router.get("/enrollments/count/:courseId", authMiddleware, getEnrollmentCount);

module.exports= router;