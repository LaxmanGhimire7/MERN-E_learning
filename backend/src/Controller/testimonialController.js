const Testimonial = require("../Model/testimonialModel");

// Add Testimonial
const addTestimonial = async (req, res) => {
  try {
    const { course, message } = req.body;
    const student = req.user.id; // from auth middleware
    const image = req.file ? req.file.filename : "default-avatar.png";

    if (!course || !message) {
      return res.status(400).json({ msg: "Course and message required" });
    }

    const testimonial = await Testimonial.create({
      student: req.user._id,
      course,
      message,
      image,
    });

    res.status(201).json({ msg: "Testimonial submitted", testimonial });
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

const getAllTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find({})
      .populate("student", "userName firstName lastName")
      .populate("course", "name");
    res.status(200).json({ testimonials });

    // console.log( testimonials);

  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};


const getApprovedTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find({ isApproved: true })
      .populate("student", "firstName lastName userName")
      .populate("course", "name");

    res.status(200).json({ testimonials });
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

// Admin approves testimonial
const approveTestimonial = async (req, res) => {
  try {
    const { id } = req.params;
    const testimonial = await Testimonial.findByIdAndUpdate(id, { isApproved: true }, { new: true });
    if (!testimonial) return res.status(404).json({ msg: "Testimonial not found" });

    res.status(200).json({ msg: "Testimonial approved", testimonial });
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

// Optional: Admin delete testimonial
const deleteTestimonial = async (req, res) => {
  try {
    const { id } = req.params;
    const testimonial = await Testimonial.findByIdAndDelete(id);
    if (!testimonial) return res.status(404).json({ msg: "Testimonial not found" });

    res.status(200).json({ msg: "Testimonial deleted", testimonial });
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

module.exports = { addTestimonial,getAllTestimonials, getApprovedTestimonials, approveTestimonial, deleteTestimonial };
