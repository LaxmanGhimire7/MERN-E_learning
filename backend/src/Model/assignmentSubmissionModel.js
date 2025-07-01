const mongoose = require("mongoose");

const assignmentSubmissionSchema = mongoose.Schema({

    assignment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Assignment",
    required: true
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  fileUrl: {
    type: String,
    required: true
  },
  grade: {
    type: Number,
    min: 0,
    max: 100
  },
  feedback: String,
  submittedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true }

);

const AssignmentSubmission = mongoose.model("AssignmentSubmission", assignmentSubmissionSchema);
module.exports = AssignmentSubmission;