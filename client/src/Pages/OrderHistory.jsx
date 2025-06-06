import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../Context/AuthProvider";

function OrderHistory() {
  const [order, setOrder] = useState([]);
  const { state } = useContext(AuthContext);

  const getOrder = async () => {
    try {
      let response = await fetch("http://localhost:9000/api/order/getUserOrder", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${state.token}`,
        },
      });
      response = await response.json();
      console.log(response);
      setOrder(Array.isArray(response.orderList) ? response.orderList : []);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    }
  };

  useEffect(() => {
    getOrder();
  }, []);

  return (
    <div className="p-4 space-y-4">
      {order.length > 0 ? (
        <div className="space-y-4">
          {order.map((item) => (
            <div key={item._id} className="border p-4 rounded shadow">
              <h2 className="text-lg font-bold">Order ID: {item.id}</h2>
              <p className="text-gray-600">Payment Status: {item.paymentStatus}</p>
              <ul className="list-disc pl-5 mt-2">
                {item?.courses.map((order) => (
                 <li key={order.courseId?._id || order}>
                    {order.courseId?.name || "Unknown Course"} — Rs {order.price}
                  </li>
                ))}
              </ul>
              <p className="text-sm text-gray-500 mt-2">Date: {new Date(item.createdAt).toLocaleDateString()}</p>
              <p className="text-sm text-gray-500 mt-2">Payment Method: {item.paymentMethod}</p>
            </div>
          ))}
        </div>
      ) : (
     <div className="text-gray-500 animate-bounce ">No order yet!</div>
      )}
    </div>
  );
}

export default OrderHistory;


// {order.map((item, index) => {
//   console.log("Order Item:", item); // 🛠️ Check this in the browser console
//   return (
//     <div key={item._id || index} className="border p-4 rounded shadow">
//       <h2 className="text-lg font-bold">Order ID: {item._id || "Not available"}</h2>
//       <p className="text-gray-600">Payment Status: {item.paymentStatus}</p>
//       <ul className="list-disc pl-5 mt-2">
//         {item.courses.map((c, i) => (
//           <li key={c._id || i}>
//             {c.courseId?.name || "Unknown Course"} — Rs {c.price}
//           </li>
//         ))}
//       </ul>
//       <p className="text-sm text-gray-500 mt-2">Date: {new Date(item.createdAt).toLocaleDateString()}</p>
//     </div>
//   );
// })}