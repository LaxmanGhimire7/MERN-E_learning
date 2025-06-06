const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },

    courses: [
      {
        courseId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Course",
          required: true,
        },
        name: String,
        price: Number,
      },
    ],

    paymentStatus: {
      type: String,
      enum: ["COMPLETE", "PENDING", "CANCELED", "FULL_REFUND"],
      default: "PENDING",
    },

    paymentMethod: {
      type: String,
      enum: ["KHALTI", "ESEWA", "STRIPE", "PAYPAL"],
      default: "KHALTI",
    },

    totalAmount: {
      type: Number,
      required: true,
    },

    isPaid: {
      type: Boolean,
      default: false,
    },

    paidAt: Date,

    accessGranted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
