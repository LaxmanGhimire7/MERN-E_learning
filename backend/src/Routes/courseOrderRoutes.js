const express = require("express");
const router = express.Router();

const {createCourseOrder, getUserOrder, success, getOrder}= require("../Controller/courseOrderController");
const authMiddleware = require("../Middleware/authMiddleware");

router.post("/createCourseOrder", authMiddleware, createCourseOrder);
router.get("/getUserOrder", authMiddleware, getUserOrder)
router.get("/success", success);
router.get("/getOrder/:id", getOrder);

module.exports= router;