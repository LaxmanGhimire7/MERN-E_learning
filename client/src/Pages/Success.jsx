import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function Success() {
  const { id } = useParams();
  const [orderDetail, setOrderDetail] = useState({});

  useEffect(() => {
    // define async function inside useEffect
    const getOrder = async () => {
      try {
        let response = await fetch(`http://localhost:9000/api/order/getOrder/${id}`);
        response = await response.json();
        console.log(response);
        setOrderDetail(response.response || response);  // Adjust according to your API response shape
      } catch (error) {
        console.error("Failed to fetch order:", error);
      }
    };

    if (id) {
      getOrder();
    }
  }, [id]); // run when id changes

  return (
    <div className="shadow-2xl shadow-gray-950 w-96 space-x-3 gap-y-3.5 h-52 flex flex-col justify-center items-center rounded-2xl m-auto p-5 mt-16">
      <h1 className="text-3xl underline">Payment is Success</h1>
      <h1>
        Payment Status: <span className="bg-orange-400 px-2 rounded">{orderDetail?.paymentStatus || 'Loading...'}</span>
      </h1>
      <h1>
        Transaction Id: <span className="bg-orange-400 px-2 rounded">{orderDetail?._id || 'Loading...'}</span>
      </h1>
    </div>
  );
}

export default Success;
