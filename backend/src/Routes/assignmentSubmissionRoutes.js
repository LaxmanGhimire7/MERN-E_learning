const express = require("express");
const router = express.Router();

const authMiddleware = require("../Middleware/authMiddleware");
const upload = require("../Middleware/upload")
const {getStudentAssignments, submitAssignment, getStudentSubmissions,getAssignmentsForInstructor, getAllSubmissionsForInstructor, gradeAssignment} = require("../Controller/assignmentSubmissionController");

router.get("/student", authMiddleware, getStudentAssignments);
router.post("/submit", authMiddleware, upload.single("assignmentFile"), submitAssignment);
router.get("/student-submissions", authMiddleware, getStudentSubmissions);
router.get("/instructor/:assignmentId", authMiddleware, getAllSubmissionsForInstructor);
router.get("/instructor", authMiddleware, getAssignmentsForInstructor);
router.put("/grade/:submissionId", authMiddleware, gradeAssignment);

module.exports= router;

