const Order = require("../Model/orderModel");


const createOrder = async (req, res) => {
  try {
    const { courseId, paymentMethod, paidAmount } = req.body;

    const newOrder = new Order({
      userId: req.user._id,
      courseId,
      paymentMethod,
      paidAmount,
    });

    const savedOrder = await newOrder.save(); 
    res.status(201).json({ message: "Order placed successfully", order: savedOrder });
  } catch (error) {
    console.error("Error saving order:", error);
    res.status(500).json({ message: "Order failed", error });
  }
};

const getUserOrder = async (req, res)=>{
let userId = req.user._id;

}


module.exports={createOrder, getUserOrder}