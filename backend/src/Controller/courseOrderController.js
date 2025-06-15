const CourseOrder = require("../Model/courseOrderModel");

const createCourseOrder = async (req, res) => {
  try {
    const { course, paymentMethod, paidAmount } = req.body;

    const newOrder = new CourseOrder({ 
      userId: req.user._id,
      course,
      paymentMethod,
      paidAmount,
    });

    const savedOrder = await newOrder.save();
    res
      .status(201)
      .json({ message: "Order placed successfully", order: savedOrder });
  } catch (error) {
    console.error("Error saving order:", error);
    res.status(500).json({ message: "Order failed", error });
  }
};

const getUserOrder = async (req, res) => {
  try {
    let userId = req.user._id;
    console.log("UserId:", userId);

    let orderList = await CourseOrder.find({ userId }).populate("course.courseId");
    console.log("Orders:", orderList);

    // Send the found orders as JSON response
    res.status(200).json(orderList);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Failed to fetch orders", error });
  }
};


module.exports = { createCourseOrder, getUserOrder };
