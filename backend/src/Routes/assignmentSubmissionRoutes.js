const express = require("express");
const router = express.Router();
const authMiddleware = require("../Middleware/authMiddleware");
const upload = require("../Middleware/upload")

const {
  submitAssignment,
  getSubmissionsByCourse,
  gradeSubmission,
  getMySubmissions
} = require("../Controller/assignmentSubmissionController");


router.post("/student/submit/:assignmentId", authMiddleware, upload.single("file"), submitAssignment);
router.get("/instructor/submissions/:courseId", authMiddleware, getSubmissionsByCourse);
router.post("/instructor/grade/:submissionId", authMiddleware, gradeSubmission);
router.get("/student/my-submissions", authMiddleware, getMySubmissions);

module.exports = router;
