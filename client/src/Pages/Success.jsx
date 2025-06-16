import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { FaCheckCircle, FaReceipt, FaClock, FaRupeeSign } from 'react-icons/fa';
import { motion } from 'framer-motion';
import jsPDF from 'jspdf';
import esewa from "../images/esewa.png"

function Success() {
  const { id } = useParams();
  const [orderDetail, setOrderDetail] = useState({});
  const [loading, setLoading] = useState(true);
  const receiptRef = useRef();

  useEffect(() => {
    const getOrder = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:9000/api/order/getOrder/${id}`);
        const data = await response.json();
        setOrderDetail(data.response || {});
      } catch (error) {
        console.error("Failed to fetch order:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) getOrder();
  }, [id]);

  const formatDate = (dateString) => {
    if (!dateString) return 'Loading...';
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Generate PDF from the receiptRef content
  const handleDownloadReceipt = () => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'pt',
      format: 'a4',
    });

    // Basic text output for demo — you can customize this to make it prettier
    const marginLeft = 40;
    let verticalOffset = 40;

    doc.setFontSize(22);
    doc.text('Payment Successful!', marginLeft, verticalOffset);
    verticalOffset += 30;

    doc.setFontSize(16);
    doc.text(`Transaction ID: ${orderDetail?._id || 'N/A'}`, marginLeft, verticalOffset);
    verticalOffset += 25;

    doc.text(`Payment Status: ${orderDetail?.paymentStatus || 'Processing'}`, marginLeft, verticalOffset);
    verticalOffset += 25;

    doc.text(`Amount Paid: ₹${orderDetail?.paidAmount?.toLocaleString('en-IN') || '0.00'}`, marginLeft, verticalOffset);
    verticalOffset += 25;

    doc.text(`Paid At: ${formatDate(orderDetail?.enrolledAt)}`, marginLeft, verticalOffset);
    verticalOffset += 40;

    doc.setFontSize(12);
    doc.text('Thank you for your purchase.', marginLeft, verticalOffset);
    verticalOffset += 20;

    doc.text('eSewa', marginLeft, verticalOffset);


    const fileName = `Receipt_${orderDetail?._id || new Date().getTime()}.pdf`;
    doc.save(fileName);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-cyan-50 flex flex-col items-center justify-center p-4">
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden"
        ref={receiptRef}
      >
        {/* Header */}
        <div className="bg-green-500 py-8 px-6 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
            transition={{ delay: 0.2, type: 'tween', duration: 0.8, ease: 'easeInOut' }}
          >
            <FaCheckCircle className="text-white text-6xl mx-auto mb-4" />
          </motion.div>
          <h1 className="text-3xl font-bold text-white">Payment Successful!</h1>
          <p className="text-green-100 mt-2">
            Thank you for your purchase
          </p>
        </div>

        {/* Body */}
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-full mr-3">
                <FaReceipt className="text-green-600 text-xl" />
              </div>
              <div>
                <h2 className="text-gray-500 text-sm">Transaction ID</h2>
                {loading ? (
                  <div className="h-6 w-40 bg-gray-200 rounded animate-pulse mt-1"></div>
                ) : (
                  <p className="font-medium">{orderDetail?._id || 'N/A'}</p>
                )}
              </div>
            </div>
            
            <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
              {orderDetail?.paymentStatus || 'Processing'}
            </div>
          </div>

          <div className="space-y-4">
            {/* Amount */}
            <div className="flex items-center p-3 bg-green-50 rounded-xl">
              <div className="bg-white p-2 rounded-lg mr-3 shadow-sm">
                <FaRupeeSign className="text-green-600 text-xl" />
              </div>
              <div className="flex-1">
                <h3 className="text-gray-500 text-sm">Amount Paid</h3>
                {loading ? (
                  <div className="h-5 w-24 bg-gray-200 rounded animate-pulse mt-1"></div>
                ) : (
                  <p className="text-xl font-bold text-gray-800">
                    ₹{orderDetail?.paidAmount?.toLocaleString('en-IN') || '0.00'}
                  </p>
                )}
              </div>
            </div>

            {/* Date */}
            <div className="flex items-center p-3 bg-cyan-50 rounded-xl">
              <div className="bg-white p-2 rounded-lg mr-3 shadow-sm">
                <FaClock className="text-cyan-600 text-xl" />
              </div>
              <div>
                <h3 className="text-gray-500 text-sm">Paid At</h3>
                {loading ? (
                  <div className="h-5 w-40 bg-gray-200 rounded animate-pulse mt-1"></div>
                ) : (
                  <p className="font-medium">
                    {formatDate(orderDetail?.enrolledAt)}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* eSewa Branding */}
          <div className="mt-8 pt-5 border-t border-gray-100 flex justify-center">
            <img className='h-12' src={esewa} alt="" />
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 p-6 text-center">
          <button 
            className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-full transition duration-300 transform hover:scale-[1.02] shadow-md"
            onClick={handleDownloadReceipt}
          >
            Download Receipt
          </button>
          <p className="text-gray-500 text-sm mt-4">
            A copy has been sent to your registered email
          </p>
        </div>
      </motion.div>

      {/* Additional decorative elements */}
      <div className="mt-8 text-center max-w-md">
        <h3 className="text-gray-600 font-medium">Need assistance?</h3>
        <p className="text-gray-500 mt-1">
          Contact eSewa support at <span className="text-blue-500">support@esewa.com.np</span> 
          or call <span className="text-blue-500">+977-9861833371</span>
        </p>
      </div>
    </div>
  );
}

export default Success;
