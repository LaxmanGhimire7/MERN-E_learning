import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../Context/CartProvider";
import { AuthContext } from "../Context/AuthProvider";
import {
  FaPlus,
  FaMinus,
  FaTrash,
  FaShoppingBag,
  FaArrowLeft,
} from "react-icons/fa";
import { toast } from "react-toastify";
import esewa from "../images/esewa.png";
import khalti from "../images/Khalti.png";
import stripe from "../images/stripe.png";
import paypal from "../images/paypal.png";

function Cart() {
  const navigate = useNavigate();
  const { state: cartState, dispatch } = useContext(CartContext);
  const { state: authState, user } = useContext(AuthContext);

  const [phone, setPhone] = useState("");
  const [fullName, setFullName] = useState("");

  const totalAmount = cartState.cartItems.reduce(
    (acc, item) => acc + item.qty * item.discountPrice,
    0
  );

  const totalItem = cartState.cartItems.reduce(
    (acc, item) => acc + item.qty,
    0
  );

  const handleOrder = async () => {
    if (!user?._id || !authState.token) {
      navigate("/students-login");
      toast.info("Please login to complete your order");
      return;
    }


    const courses = cartState.cartItems.map((item) => ({
      courseId: item._id,
      name: item.name,
      price: item.discountPrice,
    }));

    const payload = {

      courses,
      totalAmount,
    };

    try {
      const res = await fetch("http://localhost:9000/api/order/createOrder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authState.token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(`Order failed: ${data?.msg || "Unknown error"}`);
        return;
      }

      toast.success("Order placed successfully!");
      dispatch({ type: "ClearCart" });

      navigate("/payment", {
        state: {
          totalAmount,
          totalItem,
          courseId: data?.response?.courses?.[0]?.courseId,
        },
      });
    } catch (err) {
      toast.error(`Order error: ${err.message}`);
    }
  };

  const handleClearCart = () => {
    dispatch({ type: "ClearCart" });
    toast.info("Cart cleared");
  };

  const paymentMethods = [
    { id: "KHALTI", name: "Khalti", icon: khalti },
    { id: "ESEWA", name: "eSewa", icon: esewa },
    { id: "STRIPE", name: "Stripe", icon: stripe },
    { id: "PAYPAL", name: "PayPal", icon: paypal },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => navigate("/allCourses")}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6 transition-colors"
        >
          <FaArrowLeft /> Back to Courses
        </button>

        <h1 className="text-3xl md:text-4xl font-bold mb-6 flex items-center gap-3">
          <FaShoppingBag className="text-blue-600" /> Your Shopping Cart
        </h1>

        {cartState.cartItems.length === 0 ? (
          <div className="text-center mt-20 flex flex-col items-center">
            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 flex items-center justify-center mb-4">
              <FaShoppingBag className="text-3xl text-gray-500" />
            </div>
            <p className="text-gray-600 text-xl mb-6">Your cart is empty</p>
            <button
              onClick={() => navigate("/allCourses")}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
            >
              Browse Courses
            </button>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left - Cart Items */}
            <div className="flex-1">
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
                  <h2 className="font-bold text-gray-700">Your Courses</h2>
                  <button
                    onClick={handleClearCart}
                    className="text-red-500 hover:text-red-700 flex items-center gap-1 text-sm"
                  >
                    <FaTrash /> Clear Cart
                  </button>
                </div>

                {cartState.cartItems.map((item) => (
                  <div
                    key={item._id}
                    className="flex flex-col sm:flex-row gap-6 p-6 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors"
                  >
                    <img
                      src={`http://localhost:9000/image/${item.image}`}
                      alt={item.name}
                      className="w-full sm:w-40 h-32 object-cover rounded-xl shadow-sm"
                    />
                    <div className="flex-1">
                      <h2 className="text-xl font-bold text-gray-800">
                        {item.name}
                      </h2>
                      <p className="text-gray-600 text-sm mb-3">
                        Instructor: {item.instructor}
                      </p>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 bg-gray-100 rounded-full px-3 py-1">
                          <button
                            onClick={() =>
                              dispatch({
                                type: "Decreament",
                                payload: { id: item._id },
                              })
                            }
                            className="p-2 text-gray-600 hover:bg-gray-200 rounded-full transition-colors"
                          >
                            <FaMinus size={12} />
                          </button>
                          <span className="font-bold text-lg w-6 text-center">
                            {item.qty}
                          </span>
                          <button
                            onClick={() =>
                              dispatch({
                                type: "Increment",
                                payload: { id: item._id },
                              })
                            }
                            className="p-2 text-gray-600 hover:bg-gray-200 rounded-full transition-colors"
                          >
                            <FaPlus size={12} />
                          </button>
                        </div>
                        <button
                          onClick={() =>
                            dispatch({
                              type: "RemoveItem",
                              payload: item._id,
                            })
                          }
                          className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                        >
                          <FaTrash size={16} />
                        </button>
                      </div>
                    </div>
                    <div className="text-right min-w-[120px]">
                      <p className="text-sm text-gray-500 line-through">
                        Rs.{item.price}
                      </p>
                      <p className="text-xl font-bold text-blue-600">
                        Rs.{item.discountPrice * item.qty}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right - Summary */}
            <div className="w-full lg:w-96">
              <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
                <h3 className="text-xl font-bold mb-5 pb-3 border-b border-gray-200">
                  Order Summary
                </h3>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Items ({totalItem})</span>
                    <span>Rs.{totalAmount}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-3 border-t border-gray-200">
                    <span>Total</span>
                    <span className="text-blue-600">Rs.{totalAmount}</span>
                  </div>
                </div>

                {/* Payment Methods (Display only) */}
                <div className="mb-6">
                  <label className="block mb-3 font-medium text-gray-700">
                    Payment Methods Available
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {paymentMethods.map((item) => (
                      <div
                        key={item.id}
                        className="border rounded-lg p-3 flex flex-col items-center bg-gray-50"
                      >
                        <img
                          src={item.icon}
                          alt={item.name}
                          className="h-8 w-32 object-contain mb-2"
                        />
                        <span className="text-sm text-gray-700">
                          {item.name}
                        </span>
                      </div>
                    ))}
                  </div>
                 
                </div>


                <button
                  onClick={handleOrder}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white py-3 rounded-lg font-bold shadow-lg hover:shadow-xl transition-all mb-4"
                >
                  Place Order
                </button>

                <button
                  onClick={() => navigate("/allCourses")}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 rounded-lg font-medium transition-colors"
                >
                  Continue Adding Courses
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;
