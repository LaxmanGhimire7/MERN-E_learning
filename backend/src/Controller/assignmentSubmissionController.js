const AssignmentSubmission = require("../Model/assignmentSubmissionModel");
const Assignment = require("../Model/assignmentModel");

// Student: Submit Assignment
const submitAssignment = async (req, res) => {
  const fileUrl = req.file?.filename;
  const student = req.user.id;
  const { assignmentId } = req.params;

  if (!fileUrl || !assignmentId || !student) {
    return res.status(400).json({ status: 400, msg: "Missing required fields" });
  }

  try {
    let submission = new AssignmentSubmission({ assignment: assignmentId, student, fileUrl });
    submission = await submission.save();

    return res.status(201).json({ status: 201, msg: "Assignment submitted", data: submission });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ status: 500, msg: "Error submitting assignment" });
  }
};


const getSubmissionsByCourse = async (req, res) => {
  const { courseId } = req.params;

  try {
    const assignments = await Assignment.find({ course: courseId });
    const assignmentIds = assignments.map(a => a._id);

    const submissions = await AssignmentSubmission.find({ assignment: { $in: assignmentIds } })
      .populate("assignment")
      .populate("student");

    return res.status(200).json({ status: 200, msg: "Submissions fetched", data: submissions });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ status: 500, msg: "Error fetching submissions" });
  }
};


const gradeSubmission = async (req, res) => {
  const { submissionId } = req.params;
  const { grade, feedback } = req.body;

  try {
    const updated = await AssignmentSubmission.findByIdAndUpdate(
      submissionId,
      { grade, feedback },
      { new: true }
    );

    return res.status(200).json({ status: 200, msg: "Graded successfully", data: updated });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ status: 500, msg: "Grading failed" });
  }
};


const getMySubmissions = async (req, res) => {
  const studentId = req.user.id;

  try {
    const submissions = await AssignmentSubmission.find({ student: studentId })
      .populate("assignment")
      .populate("student");

    return res.status(200).json({ status: 200, msg: "Submissions fetched", data: submissions });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ status: 500, msg: "Failed to fetch submissions" });
  }
};

module.exports = {
  submitAssignment,
  getSubmissionsByCourse,
  gradeSubmission,
  getMySubmissions
};
