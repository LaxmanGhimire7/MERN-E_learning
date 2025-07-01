const Assignment = require("../Model/assignmentModel");

const createAssignment = async (req, res) => {
  const { course, title, description, dueDate } = req.body;
  const instructorId = req.user.id;

  if (!course || !title || !instructorId) {
    return res.status(400).json({ status: 400, msg: "Required fields missing" });
  }

  try {
    const assignment = new Assignment({
      course,
      title,
      description,
      dueDate,
      createdBy: instructorId,
    });

    await assignment.save();

    return res.status(201).json({ status: 201, msg: "Assignment created", data: assignment });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: 500, msg: "Error creating assignment" });
  }
};


const getAssignmentsByCourse = async (req, res) => {
  const { courseId } = req.params;

  try {
    const assignments = await Assignment.find({ course: courseId });
    if (!assignments || assignments.length === 0) {
      return res.status(404).json({ status: 404, msg: "No assignments found" });
    }

    return res.status(200).json({ status: 200, msg: "Assignments fetched", data: assignments });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ status: 500, msg: "Error fetching assignments" });
  }
};

module.exports = {
  createAssignment,
  getAssignmentsByCourse
};
