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

    res.status(200).json(orderList);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Failed to fetch orders", error });
  }
};


const success = async (req, res) => {
  try {
    console.log("eSewa success query:", req.query);

    const { data } = req.query;

    if (!data) {
      return res.status(400).json({ status: 400, msg: "Missing query parameters" });
    }

    // Decode Base64 data parameter
    const decodedData = Buffer.from(data, 'base64').toString('utf-8');
    const paymentDetails = JSON.parse(decodedData);

    const { transaction_uuid, status } = paymentDetails;

    if (!transaction_uuid || !status) {
      return res.status(400).json({ status: 400, msg: "Missing transaction_uuid or status" });
    }

    // Find the order in DB
    const order = await CourseOrder.findById(transaction_uuid);
    if (!order) {
      return res.status(404).json({ status: 404, msg: "Order not found" });
    }

    // Update payment status
    await CourseOrder.findByIdAndUpdate(
      transaction_uuid,
      { paymentStatus: status },
      { new: true }
    );

    // Redirect to success page with order id
    res.redirect(`http://localhost:5173/success/${transaction_uuid}`);
  } catch (error) {
    console.error("Error in payment success:", error);
    res.status(500).json({ status: 500, msg: "Internal Server Error" });
  }
};


const getOrder = async(req, res)=>{
  const data = req.params;
  // console.log(data.id)
  let response = await CourseOrder.findById({ _id: data.id });
  res.status(200).json({ status: 200, msg: "Order is found", response });
}



module.exports = { createCourseOrder, getUserOrder, success, getOrder };
