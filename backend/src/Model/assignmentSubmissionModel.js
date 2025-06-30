const mongoose = require("mongoose");

const assignmentSubmissionSchema = mongoose.Schema({


});

const AssignmentSubmission = mongoose.model("AssignmentSubmission", assignmentSubmissionSchema);
module.exports = AssignmentSubmission;