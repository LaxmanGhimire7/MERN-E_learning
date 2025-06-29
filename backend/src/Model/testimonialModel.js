const mongoose = require("mongoose");

const testimonialSchema = new mongoose.Schema({

     student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true
  },
  message: {
    type: String,
    required: true
  },
  image: {
    type: String,
    default: "default-avatar.png"
  },
  isApproved: {
    type: Boolean,
    default: false  // Admin can approve before showing on home
  }
}, {
  timestamps: true   

});

const Testimonial = mongoose.model("Testimonial", testimonialSchema);
module.exports = Testimonial;