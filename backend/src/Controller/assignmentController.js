const Assignment = require("../Model/assignmentModel");
const CourseOrder = require("../Model/courseOrderModel");
const Course = require("../Model/courseModel");

const createAssignment = async (req, res) => {
  try {
    const {
      title,
      description,
      dueDate,
      courseId,
      assignToAll = true,
      assignTo,
    } = req.body;

    let studentIds = [];
    if (assignToAll === "false" || assignToAll === false) {
      let parsedAssignTo = assignTo;
      if (typeof assignTo === "string") {
        try {
          parsedAssignTo = JSON.parse(assignTo);
        } catch (err) {
          return res.status(400).json({ msg: "Invalid assignTo format" });
        }
      }

      if (!Array.isArray(parsedAssignTo)) {
        return res.status(400).json({ msg: "assignTo must be an array" });
      }

      studentIds = parsedAssignTo;
    }

    const assignment = new Assignment({
      title,
      description,
      dueDate,
      courseId,
      instructorId: req.user.id,
      assignToAll: assignToAll === "true" || assignToAll === true,
      assignTo: studentIds,
      attachment: req.file?.filename,
    });

    await assignment.save();
    return res.status(201).json({ msg: "Assignment created", assignment });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "Server error" });
  }
};

const getAssignmentsForCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    let filter = { courseId };

    if (req.user.role === "student") {
      filter = {
        courseId,
        $or: [{ assignToAll: true }, { assignTo: req.user._id }],
      };
    } else if (req.user.role === "instructor") {
      filter.instructorId = req.user._id;
    }

    const assignments = await Assignment.find(filter)
      .sort({ dueDate: 1 })
      .populate("courseId", "name")
      .populate("assignTo", "firstName email");

    res.status(200).json({ status: 200, assignments });
  } catch (error) {
    res
      .status(500)
      .json({ msg: "Error fetching assignments", error: error.message });
  }
};

const updateAssignment = async (req, res) => {
  try {
    const { id } = req.params;

    const assignment = await Assignment.findById(id);
    if (!assignment)
      return res.status(404).json({ msg: "Assignment not found" });

    if (
      req.user.role !== "instructor" ||
      assignment.instructorId.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ msg: "Unauthorized" });
    }

    const {
      title,
      description,
      dueDate,
      assignToAll,
      assignTo = [],
    } = req.body;

    const assignToAllBool = assignToAll === "true" || assignToAll === true;

    let studentIds = [];

    if (assignToAllBool) {
      const orders = await CourseOrder.find({
        "course.courseId": assignment.courseId,
        enrollmentStatus: "ACTIVE",
      });
      studentIds = orders.map((order) => order.userId);
    } else {
      studentIds = assignTo;
    }

    // Optional new file
    if (req.file) {
      assignment.attachment = req.file.filename;
    }

    assignment.title = title || assignment.title;
    assignment.description = description || assignment.description;
    assignment.dueDate = dueDate || assignment.dueDate;
    assignment.assignToAll = assignToAllBool;
    assignment.assignTo = studentIds;

    await assignment.save();

    res.status(200).json({ msg: "Assignment updated", assignment });
  } catch (error) {
    res.status(500).json({ msg: "Server Error", error: error.message });
  }
};

const deleteAssignment = async (req, res) => {
  try {
    const { id } = req.params;

    const assignment = await Assignment.findById(id);
    if (!assignment)
      return res.status(404).json({ msg: "Assignment not found" });

    if (
      req.user.role !== "instructor" ||
      assignment.instructorId.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ msg: "Unauthorized" });
    }

    await assignment.deleteOne();
    res.status(200).json({ msg: "Assignment deleted successfully" });
  } catch (error) {
    res.status(500).json({ msg: "Server Error", error: error.message });
  }
};

module.exports = {
  createAssignment,
  getAssignmentsForCourse,
  updateAssignment,
  deleteAssignment,
};
