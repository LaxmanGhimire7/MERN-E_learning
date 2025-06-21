const CourseOrder = require("../Model/courseOrderModel");

const getStudentDashboard = async (req, res) => {
  try {
    const userId = req.user.id;

    // Find all COMPLETE orders for this user
    const orders = await CourseOrder.find({
      userId,
      paymentStatus: "COMPLETE",
      enrollmentStatus: "ACTIVE", // optional, only active enrollments
    }).populate("course.courseId");

    // Extract all enrolled courses from orders
    const enrolledCourses = orders.flatMap(order =>
      order.course.map(c => c.courseId)
    );

    return res.status(200).json({ enrolledCourses });
  } catch (error) {
    console.error("getStudentDashboard error:", error);
    return res.status(500).json({ msg: "Server error" });
  }
};

module.exports = { getStudentDashboard };
