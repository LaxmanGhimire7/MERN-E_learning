const CourseOrder = require("../Model/courseOrderModel");

const allowDashboardAccess = async (req, res, next) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ msg: "Unauthorized: User not found" });
    }

    // Admin and instructor can access directly
    if (["admin", "instructor"].includes(user.role)) {
      return next();
    }

    // Students need to have completed order to access
    if (user.role === "student") {
      const hasCompletedOrder = await CourseOrder.exists({
        userId: user._id,
        paymentStatus: "COMPLETE",
        enrollmentStatus: "ACTIVE",
      });

      if (!hasCompletedOrder) {
        return res
          .status(403)
          .json({ msg: "Access denied: No active enrollment" });
      }

      return next();
    }

    return res.status(403).json({ msg: "Access denied" });
  } catch (error) {
    console.error("allowDashboardAccess error:", error);
    return res.status(500).json({ msg: "Server error" });
  }
};

module.exports = allowDashboardAccess;
