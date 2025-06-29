const express = require("express");
const router = express.Router();

const {
  addTestimonial,
  getApprovedTestimonials,
  approveTestimonial,
  deleteTestimonial,
  getAllTestimonials,
} = require("../Controller/testimonialController");

const authMiddleware = require("../Middleware/authMiddleware");
const allowDashboardAccess = require("../Middleware/studentMiddleware");
const upload = require("../Middleware/upload");


router.post("/addTestimonial", authMiddleware, allowDashboardAccess, upload.single("image"), addTestimonial);

router.get("/getApprovedTestimonials", getApprovedTestimonials);

router.get("/getAllTestimonials", authMiddleware, getAllTestimonials);

router.put("/approveTestimonial/:id", authMiddleware, approveTestimonial);

router.delete("/deleteTestimonial/:id", authMiddleware, deleteTestimonial);

module.exports = router;
