const CourseOrder = require("../Model/courseOrderModel");
const User = require("../Model/userModel"); 

const getStudentDashboard = async (req, res) => {
  try {
    const userId = req.user.id;

    //  Fetch user progress data
    const user = await User.findById(userId);

    // Yeta chai active rw complete course leko hoo
    const orders = await CourseOrder.find({
      userId,
      paymentStatus: "COMPLETE",
      enrollmentStatus: "ACTIVE",
    }).populate("course.courseId");

    //enroll gareko course nikaleko yeta
    const enrolledCourses = orders.flatMap(order =>
      order.course.map(c => {
        const courseObj = c.courseId;
        const progressEntry = user.progress.find(
          p => p.courseId.toString() === courseObj._id.toString()
        );

        return {
          ...courseObj._doc,
          progress: progressEntry ? progressEntry.percentage : 0,
        };
      })
    );

    // console.log(courseObjx)
    
    return res.status(200).json({ enrolledCourses });
  } catch (error) {
    console.error("getStudentDashboard error:", error);
    return res.status(500).json({ msg: "Server error" });
  }
};

module.exports = { getStudentDashboard };
