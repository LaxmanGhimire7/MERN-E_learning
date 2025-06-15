const mongoose = require("mongoose");

const courseOrderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    course: [
      {
        courseId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Course", // This must match the name of my course model
          required: true,
        },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],
    paymentStatus: {
      type: String,
      enum: ["COMPLETE", "PENDING", "CANCELED", "FULL_REFUND"],
      default: "PENDING",
    },
    enrollmentStatus: {
      type: String,
      enum: ["ACTIVE", "EXPIRED", "CANCELED"],
      default: "ACTIVE",
    },
    paymentMethod: {
      type: String,
      enum: ["ESEWA", "KHALTI", "STRIPE", "PAYPAL"],
      required: true,
    },
    invoiceId: {
      type: String,
      default: null,
    },
    paidAmount: {
      type: Number,
      required: true,
    },
    enrolledAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const CourseOrder = mongoose.model("CourseOrder", courseOrderSchema);
module.exports = CourseOrder;
