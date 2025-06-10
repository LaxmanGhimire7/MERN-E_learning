// models/Order.js
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    orderItems: [
        {
            courseTitle: { type: String, required: true },
            price: { type: Number, required: true },
            course: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Course',
                required: true,
            },
        },
    ],
    paymentMethod: {
        type: String,
        required: true,
    },
    paymentResult: {
        id: String,
        status: String,
        update_time: String,
        email_address: String,
    },
    totalPrice: {
        type: Number,
        required: true,
        default: 0.0,
    },
    isPaid: {
        type: Boolean,
        required: true,
        default: false,
    },
    paidAt: {
        type: Date,
    },
    isActivated: {
        type: Boolean,
        required: true,
        default: false,
    },
    activatedAt: {
        type: Date,
    },
}, {
    timestamps: true,
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
