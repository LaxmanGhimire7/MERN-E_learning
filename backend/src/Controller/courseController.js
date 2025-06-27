const Course = require("../Model/courseModel");

const createCourse = async (req, res) => {
  try {
    const image = req.file ? req.file.filename : "default-picture.png";

    const isBestsellerValue =
      req.body.isBestseller === "true" || req.body.isBestseller === true;
    const isFeaturedValue =
      req.body.isFeatured === "true" || req.body.isFeatured === true;

    const { name, instructor, price, discountPrice, rating, duration } =
      req.body;

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
      isBestseller: isBestsellerValue,
      isFeatured: isFeaturedValue,
      createdBy: req.user._id, 
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
  try {
    let response = await Course.find({});
    if (!response) {
      return res.status(404).json({ status: 404, msg: "Course not Found" });
    }
    res.status(200).json({ status: 200, msg: "Course found", response });
  } catch (err) {
    res.status(500).json({ status: 500, msg: "Server Error" });
  }
};

const deleteCourse = async (req, res) => {
  const courseId = req.params.id;

  if (!courseId) {
    return res.status(400).json({ status: 400, msg: "Course ID Not Found" });
  }

  try {
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ status: 404, msg: "Course not found" });
    }

    // instructor le aafno course matra delete garna sakxa
    if (
      req.user.role === "instructor" &&
      course.createdBy.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ status: 403, msg: "Unauthorized" });
    }

    const response = await Course.findByIdAndDelete(courseId);

    return res
      .status(200)
      .json({ status: 200, msg: "Course is Deleted", data: response });
  } catch (error) {
    console.error("Error deleting course:", error);
    return res.status(500).json({ status: 500, msg: "Server error" });
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
    } = req.body;

    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ status: 404, msg: "Course not found" });
    }

    //instructor le aafno course matra edit garna sakxa
    if (
      req.user.role === "instructor" &&
      course.createdBy.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ status: 403, msg: "Unauthorized" });
    }

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
    const {
      categories,
      period,
      requirement,
      overview,
      demandsAndScopes,
      opportunities,
      whatYouWillLearn,
    } = req.body;

    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ status: 404, msg: "Course not found" });
    }

    // yo chai instructor le cha9i aafno course matra edit garna pauxa
    if (
      req.user.role === "instructor" &&
      course.createdBy.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ status: 403, msg: "Unauthorized" });
    }

    let updatedCourse = {
      categories,
      period,
      requirement,
      overview,
      demandsAndScopes,
      opportunities,
      whatYouWillLearn,
    };

    const response = await Course.findByIdAndUpdate(
      { _id: id },
      updatedCourse,
      { new: true }
    );

    res.status(200).json({
      status: 200,
      msg: "Course details updated successfully",
      response,
    });
  } catch (error) {
    console.error("Error updating course:", error);
    res.status(500).json({ status: 500, msg: "Server error", error });
  }
};

const getInstructorCourses = async (req, res) => {
  try {
    const courses = await Course.find({ createdBy: req.user._id });
    res.status(200).json({ status: 200, courses });
  } catch (error) {
    res.status(500).json({ status: 500, msg: "Server Error", error });
  }
};


module.exports = {
  createCourse,
  getAllCourse,
  deleteCourse,
  editCourse,
  editCourseDetails,
  getInstructorCourses,
};
