const mongoose = require("mongoose");


const assignmentSchema = mongoose.Schema(
  {

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    dueDate: {
      type: Date,
      required: true,
    },

    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },

    instructorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    assignTo: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    assignToAll: {
  type: Boolean,
  default: false,
},

    attachment: {
      type: String, 
      default: "",
    },
  },
  {
    timestamps: true, 
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);


const Assignment = mongoose.model("Assignment", assignmentSchema);
module.exports = Assignment;
