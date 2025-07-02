const express = require("express");
const router = express.Router();
const upload = require("../Middleware/upload");
// const authMiddleware = require("../Middleware/authMiddleware")

const { createCourse, getAllCourse, deleteCourse, editCourse,getStudentsByCourse, editCourseDetails, getCoursesForInstructor } = require("../Controller/courseController"); 
const authMiddleware = require("../Middleware/authMiddleware");

router.post("/createCourse", upload.single("image"), createCourse);
router.get("/getAllCourse", getAllCourse);
router.delete("/deleteCourse/:id", deleteCourse)
router.put("/editCourse/:id", upload.single("image"), editCourse)
router.put("/editCourseDetails/:id", upload.none(), editCourseDetails)
router.get("/instructor-courses", authMiddleware, getCoursesForInstructor);
router.get("/:courseId/students", getStudentsByCourse);



module.exports = router;
