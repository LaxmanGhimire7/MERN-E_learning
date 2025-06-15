const express = require("express");
const router = express.Router();

const {createCourseOrder, getUserOrder}= require("../Controller/courseOrderController");
const authMiddleware = require("../Middleware/authMiddleware");

router.post("/createCourseOrder", authMiddleware, createCourseOrder);
router.get("/getUserOrder", authMiddleware, getUserOrder)


module.exports= router;