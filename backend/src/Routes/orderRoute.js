const express = require("express");
const router = express.Router();
const {createOrder, getUserOrder, getAllOrders} = require("../Controller/orderController")
const authMiddleware = require("../Middleware/authMiddleware");

router.post("/createOrder", authMiddleware, createOrder);
router.get("/getUserOrder",authMiddleware, getUserOrder)
router.get("/getAllOrders",authMiddleware, getAllOrders);

module.exports= router;