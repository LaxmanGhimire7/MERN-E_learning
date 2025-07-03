const AssignmentSubmission = require("../Model/assignmentSubmissionModel");
const Assignment = require("../Model/assignmentModel");
const mongoose = require("mongoose");



const submitAssignment = async (req, res) => {
  try {
    const { assignmentId, courseId } = req.body;
    const file = req.file?.filename;
    const studentId = req.user.id;

    console.log("assignmentId:", assignmentId, "courseId:", courseId, "file:", file);

    if (!assignmentId || !courseId || !file) {
      return res.status(400).json({ msg: "Assignment ID, Course ID and file are required" });
    }

    const alreadySubmitted = await AssignmentSubmission.findOne({ assignmentId, studentId });
    if (alreadySubmitted) {
      return res.status(400).json({ msg: "Assignment already submitted" });
    }

    const submission = new AssignmentSubmission({
      assignmentId,
      studentId,
      courseId,
      file,
    });

    await submission.save();

    res.status(201).json({ msg: "Assignment submitted", submission });
  } catch (error) {
    console.error("Error submitting assignment:", error);
    res.status(500).json({ msg: "Server error" });
  }
};

const getAssignmentsForInstructor = async (req, res) => {
  try {
    const instructorId = req.user._id || req.user.id;
    console.log("Instructor ID from token:", instructorId);

    const assignments = await Assignment.find({ instructorId }).populate("courseId", "name");
    console.log("Assignments found:", assignments.length);

    res.status(200).json({ assignments });
  } catch (error) {
    console.error("Error fetching instructor assignments:", error);
    res.status(500).json({ msg: "Failed to fetch assignments" });
  }
};


// backend controller
const getStudentAssignments = async (req, res) => {
  try {
    const studentId = new mongoose.Types.ObjectId(req.user.id);
    console.log("Student ID:", studentId);
    console.log("User from token:", req.user);

    const assignments = await Assignment.find({
      $or: [
        { assignToAll: true },
        { assignTo: studentId }
      ]
    }).populate("courseId", "name");

    console.log("Fetched Assignments:", assignments);

    res.status(200).json({ status: 200, assignments });
  } catch (error) {
    console.error("Error fetching student assignments:", error);
    res.status(500).json({ status: 500, msg: "Failed to fetch assignments" });
  }
};



const getStudentSubmissions = async (req, res) => {
  try {
    const studentId = req.user.id;

    const submissions = await AssignmentSubmission.find({ studentId }).populate("assignmentId", "title dueDate");

    return res.status(200).json({ submissions });
  } catch (error) {
    console.error("Error fetching student submissions:", error);
    res.status(500).json({ msg: "Failed to fetch submissions" });
  }
};


const getAllSubmissionsForInstructor = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const submissions = await AssignmentSubmission.find({ assignmentId })
      .populate("studentId", "firstName lastName email");

    return res.status(200).json({ submissions });
  } catch (error) {
    console.error("Error fetching instructor submissions:", error);
    res.status(500).json({ msg: "Failed to fetch submissions" });
  }
};

const gradeAssignment = async (req, res) => {
  try {
    const { submissionId } = req.params;
    const { grade, feedback } = req.body;

    const updated = await AssignmentSubmission.findByIdAndUpdate(
      submissionId,
      { grade, feedback },
      { new: true }
    );

    res.status(200).json({ msg: "Graded successfully", updated });
  } catch (error) {
    console.error("Error grading assignment:", error);
    res.status(500).json({ msg: "Failed to grade assignment" });
  }
};


module.exports = {
  submitAssignment,
  getStudentAssignments,
  getAllSubmissionsForInstructor,
  gradeAssignment,
  getAssignmentsForInstructor,
  getStudentSubmissions
};
