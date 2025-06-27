import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../Context/AuthProvider";

function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const { state } = useContext(AuthContext);

  const getUserOrder = async () => {
    try {
      let response = await fetch("http://localhost:9000/api/order/getUserOrder", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${state.token}`,
        },
      });
      const data = await response.json();


      const sorted = [...data].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      setOrders(sorted);
    } catch (error) {
      console.error("Fetch order error:", error);
    }
  };

  useEffect(() => {
    if (state?.token) {
      getUserOrder();
    }
  }, [state?.token]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">My Orders</h1>

      {orders.length > 0 ? (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-xl shadow-md border border-gray-200 p-6"
            >
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-gray-700">Order ID: {order._id}</h2>
                  <p className="text-sm text-gray-500">Payment: {order.paymentStatus}</p>
                  <p className="text-sm text-gray-500">Enrollment: {order.enrollmentStatus}</p>
                </div>
                <div className="text-sm text-gray-600">
                  {new Date(order.createdAt).toLocaleString()}
                </div>
              </div>

              {order.course && order.course.length > 0 ? (
                <div className="space-y-4">
                  {order.course.map((courseItem, index) => (
                    <div
                      key={index}
                      className="flex gap-4 items-center border border-gray-100 rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition"
                    >
                      <div className="w-20 h-20 overflow-hidden rounded-md border">
                        <img
                          src={`http://localhost:9000/image/${courseItem.courseId?.image}`}
                          alt={courseItem.courseId?.name || "Course"}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800">
                          {courseItem.courseId?.name || "Unnamed Course"}
                        </h3>
                        <p className="text-sm text-gray-600">Quantity: {courseItem.quantity || 1}</p>
                        <p className="text-sm text-gray-600">
                          Category: {courseItem.courseId?.category || "General"}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-blue-600 font-semibold">
                          Rs {courseItem.courseId?.discountPrice || "N/A"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No courses in this order</p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h2 className="text-xl text-gray-600">No orders found</h2>
          <p className="text-gray-400">Your purchased courses will appear here.</p>
        </div>
      )}
    </div>
  );
}

export default OrderHistory;
