const Course = require("../Model/courseModel");

const createCourse = async (req, res) => {
  try {
    const image = req.file ? req.file.filename : "default-picture.png";

    // Convert string to boolean if using FormData
    const isBestsellerValue =
      req.body.isBestseller === "true" || req.body.isBestseller === true;
    const isFeaturedValue =
      req.body.isFeatured === "true" || req.body.isFeatured === true;

    const { name, instructor, price, discountPrice, rating, duration } =
      req.body;

    // Validate required fields
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

    // Save course
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

const deleteCourse = async (req, res) => {
  const courseId = req.params.id;
  console.log(courseId);

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

    let updatedCourse = {
      categories,
      period,
      requirement,
      overview,
      demandsAndScopes,
      opportunities,
      whatYouWillLearn,
    };

    if (!updatedCourse) {
      return res.status(404).json({ message: "Course not found" });
    }

    const response = await Course.findByIdAndUpdate(
      { _id: id },
      updatedCourse,
      { new: true }
    );
    res.status(200).json({
      status: 200,
      message: "Course details updated successfully",
      response,
    });
  } catch (error) {
     console.error("Error updating course:", error);
    res.status(500).json({ message: "Server error", error });
  };
};

module.exports = { createCourse, getAllCourse, deleteCourse, editCourse, editCourseDetails };
