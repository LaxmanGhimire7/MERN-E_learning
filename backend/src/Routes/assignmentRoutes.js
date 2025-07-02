const express = require("express");
const router = express.Router();
const auth = require("../Middleware/authMiddleware");
const upload = require("../Middleware/upload")
const {
  createAssignment,
  getAssignmentsForCourse,
  updateAssignment,
  deleteAssignment,
} = require("../Controller/assignmentController");

router.post("/createAssignment", auth, upload.single("attachment"), createAssignment);
router.get("/getAssignmentsForCourse/:courseId", auth, getAssignmentsForCourse);
router.put("/updateAssignment/:id", auth, upload.single("attachment"), updateAssignment);
router.delete("/deleteAssignment/:id", auth, deleteAssignment);

module.exports = router; 
