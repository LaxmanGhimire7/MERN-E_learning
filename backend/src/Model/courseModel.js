const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Course title is required"],
    trim: true,
  },

  instructor: {
    type: String,
    required: [true, "Instructor name is required"],
    trim: true,
  },

  rating: {
    type: Number,
    default: 0,
    min: [0, "Rating must be at least 0"],
    max: [5, "Rating cannot exceed 5"],
  },

  price: {
    type: Number,
    required: [true, "Price is required"],
    min: [0, "Price must be a positive number"],
  },
  discountPrice: {
    type: Number,
    required: [true, "Original price is required"],
    min: [0, "Original price must be a positive number"],
  },

  duration: {
    type: String,
    default: "Self-paced",
  },

  isBestseller: {
    type: Boolean,
    default: false,
  },

  image: {
    type: String,
    default: "default-course.jpg", // Placeholder image
  },

  isFeatured: {
    type: Boolean,
    default: false,
  },

  categories:{
    type: String,
    enum: ["Beginner", "Intermediate", "Advanced"],
    default:"Beginner",
  },

  period:{
    type:String,
    enum: ["Short-term", "Long-term"]
  },

  requirement:{
    type:[String],
    default:[]
  },

  fields: {
  type: String,
  enum: [
    "Development",
    "Digital Marketing",
    "App Development",
    "Design",
    "Data Science",
    "DevOps",
    "Machine Learning",
    "Cloud Computing",
    "Cybersecurity",
    "QA Testing",
    "Project Management",
    "AI"
  ],
},


  overview: {
    type: String,
  },
  demandsAndScopes: {
    type: String,
  },
  opportunities: {
    type: String,
  },
  whatYouWillLearn: {
    section1Title: String,
    section1Points: [String],
    section2Title: String,
    section2Points: [String],
  },


},{
  timestamps: true,
  toJSON: {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
      ret.id = ret._id;
      return ret;
    }}}



 

);

const Course = mongoose.model("Course", courseSchema);
module.exports = Course;
