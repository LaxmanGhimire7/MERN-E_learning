const mongoose = require("mongoose");

const orderSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "course",
      required: true,

    },
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
      enum: ["eSewa", "Khalti", "Stripe", "PayPal"],
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

const Order = mongoose.model("order", orderSchema);
module.exports = Order;
