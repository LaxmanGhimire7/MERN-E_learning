const express = require("express");
const router = express.Router();
const authMiddleware = require("../Middleware/authMiddleware");

const {createAssignment, getAssignmentsByCourse} = require("../Controller/assignmentController");

router.post("/instructor/create", authMiddleware,createAssignment);
router.get("/instructor/course/:courseId", authMiddleware, getAssignmentsByCourse);


module.exports = router;