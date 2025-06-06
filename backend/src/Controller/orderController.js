const Order = require("../Model/orderModel");



const createOrder = async (req, res) => {
  try {
    const userId = req.user._id;
    const { courses, totalAmount, paymentMethod, name, email, phone, isInstallment } = req.body;

    // Basic validations
    if (!courses || courses.length === 0) {
      return res.status(400).json({ status: 400, msg: "Course data is required" });
    }

    if (!totalAmount) {
      return res.status(400).json({ status: 400, msg: "Total amount is required" });
    }

    if (!paymentMethod) {
      return res.status(400).json({ status: 400, msg: "Payment method is required" });
    }

    if (!name || !email || !phone) {
      return res.status(400).json({ status: 400, msg: "Name, email, and phone are required" });
    }

    const newOrder = new Order({
      userId,
      name,           
      email,         
      phone,          
      courses,
      totalAmount,
      paymentMethod,
      isInstallment,  
    });

    const savedOrder = await newOrder.save();
    res.status(201).json({
      status: 201,
      msg: "Order is created",
      response: savedOrder,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ status: 500, msg: "Server error", error: error.message });
  }
};


const getUserOrder = async (req, res) => {
  try {
    const userId = req.user._id;

    const orderList = await Order.find({ userId })
      .populate("courses.courseId")
      .sort({ createdAt: -1 }); //yesle chai kun order recent ako tei anusar dekhauxa

    if (!orderList || orderList.length === 0) {
      return res.status(404).json({ status: 404, msg: "No orders found." });
    }

    res.status(200).json({ status: 200, msg: "Orders found", orderList });
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).json({ status: 500, msg: "Server error", error: error.message });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId", "firstName lastName email") 
      .populate("courses.courseId", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({ status: 200, orders });
  } catch (error) {
    res.status(500).json({ status: 500, msg: "Server error", error: error.message });
  }
};


module.exports = { createOrder, getUserOrder, getAllOrders };
