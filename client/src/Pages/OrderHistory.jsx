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
      response = await response.json();
      console.log("Order response:", response);
      setOrders(response);
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
    <div>
      {orders.length > 0 ? (
        <div>
          {orders.map((item) => (
            <div key={item._id} className="shadow-2xl shadow-gray-800 p-5 m-2">
              <h1>Payment Status: {item.paymentStatus}</h1>
              <h1>Order Status: {item.enrollmentStatus}</h1>

              <div>
                {item.course && item.course.length > 0 ? (
                  <div>
                    {item.course.map((courseItem, index) => (
                       <div key={index}>
    <h1>Quantity: {courseItem.quantity || 1}</h1>
    <h1>Name: {courseItem.courseId?.name || "No name"}</h1>
    <img
      className="h-12"
      src={`http://localhost:9000/image/${courseItem.courseId?.image}`}
      alt={courseItem.courseId?.name || "course image"}
    />
  </div>
                    ))}
                  </div>
                ) : (
                  <p>No courses in this order</p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div>Order not found</div>
      )}
    </div>
  );
}

export default OrderHistory;
