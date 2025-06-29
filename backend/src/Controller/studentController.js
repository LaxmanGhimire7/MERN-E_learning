const CourseOrder = require("../Model/courseOrderModel");
const User = require("../Model/userModel"); 

const getStudentDashboard = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId);
    
    const orders = await CourseOrder.find({
      userId,
      paymentStatus: "COMPLETE",
      enrollmentStatus: "ACTIVE",
    }).populate("course.courseId");


    const enrolledCourses = orders.flatMap(order =>
      order.course
        .filter(c => c.courseId != null) 
        .map(c => {
          const courseObj = c.courseId;
          const progressEntry = user.progress?.find(
            p => p.courseId.toString() === courseObj._id.toString()
          );

          return {
            ...courseObj._doc,
            progress: progressEntry ? progressEntry.percentage : 0,
          };
        })
    );

    return res.status(200).json({ enrolledCourses });
  } catch (error) {
    console.error("getStudentDashboard error:", error);
    return res.status(500).json({ msg: "Server error" });
  }
};

module.exports = { getStudentDashboard };
