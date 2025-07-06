const Course = require("../Model/courseModel");
const CourseOrder = require("../Model/courseOrderModel");
const User = require("../Model/userModel");

const createCourse = async (req, res) => {
  try {
    const image = req.file ? req.file.filename : "default-course.jpg";

    const isBestsellerValue =
      req.body.isBestseller === "true" || req.body.isBestseller === true;
    const isFeaturedValue =
      req.body.isFeatured === "true" || req.body.isFeatured === true;

    const {
      name,
      instructor,
      price,
      discountPrice,
      rating,
      duration,
      tagline = "",
      language = "Nepali",
    } = req.body;

    if (
      !image ||
      !name ||
      !price ||
      !instructor ||
      !discountPrice ||
      rating === undefined ||
      rating === null ||
      duration === undefined ||
      duration === null
    ) {
      return res
        .status(400)
        .json({ status: 400, msg: "All fields are required" });
    }

    let response = new Course({
      image,
      name,
      price,
      instructor,
      discountPrice,
      rating,
      duration,
      tagline,
      language,
      isBestseller: isBestsellerValue,
      isFeatured: isFeaturedValue,
    });

    response = await response.save();

    return res
      .status(201)
      .json({ status: 201, msg: "Course created", response });
  } catch (error) {
    console.error("Create Course Error:", error);
    return res.status(500).json({ status: 500, msg: "Internal Server Error" });
  }
};

const getAllCourse = async (req, res) => {
  let response = await Course.find({});
  if (!response) {
    return res.status(404).json({ status: 404, msg: "Course not Found " });
  }
  res.status(200).json({ status: 200, msg: "Course found ", response });
};

const getStudentsByCourse = async (req, res) => {
  const { courseId } = req.params;

  try {
    const enrollments = await CourseOrder.find({
      "course.courseId": courseId,
      enrollmentStatus: "ACTIVE",
    }).populate("userId", "firstName lastName email");

    const students = enrollments
      .filter((enroll) => enroll.userId !== null)
      .map((enroll) => ({
        _id: enroll.userId._id,
        fullName: `${enroll.userId.firstName} ${enroll.userId.lastName}`,
        email: enroll.userId.email,
      }));

    res.status(200).json({ students });
  } catch (error) {
    console.error("Error fetching enrolled students:", error);
    res.status(500).json({ msg: "Failed to fetch enrolled students" });
  }
};


const deleteCourse = async (req, res) => {
  const courseId = req.params.id;

  if (!courseId) {
    return res.status(400).json({ status: 400, msg: "Course Id Not Found" });
  }

  try {
    let response = await Course.findByIdAndDelete(courseId);

    if (!response) {
      return res.status(404).json({ status: 404, msg: "Course not found" });
    }

    return res
      .status(200)
      .json({ status: 200, msg: "Course is Deleted", data: response });
  } catch (error) {
    console.error("Error deleting course:", error);
    return res.status(500).json({ status: 500, msg: "Server error" });
  }
};

const getCoursesForInstructor = async (req, res) => {
  try {
    const instructorId = req.user.id;

    const courses = await Course.find({ instructor: instructorId });

    if (!courses || courses.length === 0) {
      return res
        .status(404)
        .json({ status: 404, msg: "No courses assigned to instructor" });
    }

    res.status(200).json({ status: 200, response: courses });
  } catch (error) {
    console.error("Error getting instructor courses:", error);
    res.status(500).json({ status: 500, msg: "Server Error" });
  }
};

const editCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      instructor,
      rating,
      price,
      fields,
      discountPrice,
      isBestseller,
      isFeatured,
      duration,
      tagline,
      language,
    } = req.body;

    let updateFields = {
      name,
      instructor,
      rating,
      price,
      fields,
      discountPrice,
      isBestseller,
      isFeatured,
      duration,
      tagline,
      language,
    };

    if (req.file) {
      updateFields.image = req.file.filename;
    }

    const response = await Course.findByIdAndUpdate({ _id: id }, updateFields, {
      new: true,
    });

    res.status(200).json({ status: 200, msg: "Course Updated", response });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ status: 500, msg: "Server Error", error: error.message });
  }
};

const editCourseDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const { categories, period, overview, demandsAndScopes, opportunities } =
      req.body;

    let requirement = [];
    let whatYouWillLearn = {};

    try {
      if (req.body.requirement) {
        requirement = JSON.parse(req.body.requirement);
      }
      if (req.body.whatYouWillLearn) {
        whatYouWillLearn = JSON.parse(req.body.whatYouWillLearn);
      }
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      return res.status(400).json({ message: "Invalid JSON format" });
    }

    const updatedCourse = {
      categories,
      period,
      overview,
      demandsAndScopes,
      opportunities,
      requirement,
      whatYouWillLearn,
    };

    const response = await Course.findByIdAndUpdate(id, updatedCourse, {
      new: true,
    });

    if (!response) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.status(200).json({
      status: 200,
      message: "Course details updated successfully",
      response,
    });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  createCourse,
  getAllCourse,
  deleteCourse,
  getCoursesForInstructor,
  editCourse,
  editCourseDetails,
  getStudentsByCourse,
};
