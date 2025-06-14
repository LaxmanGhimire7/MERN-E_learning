const express = require("express");
const router = express.Router();

const {createOrder}= require("../Controller/orderController");
const authMiddleware = require("../Middleware/authMiddleware");

router.post("/createOrder", authMiddleware, createOrder);



module.exports= router;