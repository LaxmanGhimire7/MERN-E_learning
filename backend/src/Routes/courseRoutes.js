const express = require("express");
const router = express.Router();
const upload = require("../Middleware/upload");
const { createCourse, getAllCourse, deleteCourse, editCourse, editCourseDetails } = require("../Controller/courseController"); 

router.post("/createCourse", upload.single("image"), createCourse);
router.get("/getAllCourse", getAllCourse);
router.delete("/deleteCourse/:id", deleteCourse)
router.put("/editCourse/:id", upload.single("image"), editCourse)
router.put("/editCourseDetails/:id", editCourseDetails)

module.exports = router;
