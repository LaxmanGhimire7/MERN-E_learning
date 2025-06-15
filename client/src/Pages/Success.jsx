import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function Success() {
  const { id } = useParams();
  const [orderDetail, setOrderDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getOrder = async () => {
    try {
      const response = await fetch(`http://localhost:9000/api/order/getOrder/${id}`);
      const data = await response.json();
      
      if (response.ok) {
        // Adjust if your API response wraps order inside 'response' or similar key
        setOrderDetail(data.response || data); 
      } else {
        setError(data.msg || "Failed to fetch order details");
      }
    } catch (err) {
      setError("Network error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) getOrder();
  }, [id]);

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (error) return <div className="text-center mt-10 text-red-600">{error}</div>;

  return (
    <div className="shadow-2xl shadow-gray-950 w-96 space-y-3 h-52 flex flex-col justify-center items-center rounded-2xl m-auto p-5 mt-16">
      <h1 className="text-3xl underline mb-2">Payment Successful</h1>

      <h2>
        Payment Status:{" "}
        <span className="bg-orange-400 px-2 py-1 rounded">{orderDetail?.paymentStatus || "N/A"}</span>
      </h2>

      <h2>
        Transaction ID:{" "}
        <span className="bg-orange-400 px-2 py-1 rounded break-all">{orderDetail?._id || "N/A"}</span>
      </h2>

      {/* Optional: Display more order info if you want */}
      {/* <h2>Amount Paid: {orderDetail?.paidAmount || 'N/A'}</h2> */}
    </div>
  );
}

export default Success;
