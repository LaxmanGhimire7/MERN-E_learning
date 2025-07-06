import { useLocation, useNavigate } from "react-router-dom";
import CryptoJS from "crypto-js";

function Payment() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const { orderId, totalAmount, totalItem } = state;
  let transaction_uuid = orderId;

  let message = `total_amount=${totalAmount},transaction_uuid=${transaction_uuid},product_code=EPAYTEST`;
  let hash = CryptoJS.HmacSHA256(message, "8gBm/:&EnhH.1/q");
  let hashInBase64 = CryptoJS.enc.Base64.stringify(hash);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-blue-100 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          Confirm Your Payment
        </h2>

        <div className="space-y-3 mb-6 text-gray-700">
          <div className="flex justify-between">
            <span>Order ID:</span>
            <span className="font-medium">{orderId}</span>
          </div>
          <div className="flex justify-between">
            <span>Total Items:</span>
            <span className="font-medium">{totalItem}</span>
          </div>
          <div className="flex justify-between text-lg font-semibold text-gray-900">
            <span>Total Amount:</span>
            <span>NRs. {totalAmount}</span>
          </div>
        </div>

        <form
          action="https://rc-epay.esewa.com.np/api/epay/main/v2/form"
          method="POST"
        >
          <input type="hidden" name="amount" value={totalAmount} required />
          <input type="hidden" name="tax_amount" value="0" required />
          <input type="hidden" name="total_amount" value={totalAmount} required />
          <input type="hidden" name="transaction_uuid" value={transaction_uuid} required />
          <input type="hidden" name="product_code" value="EPAYTEST" required />
          <input type="hidden" name="product_service_charge" value="0" required />
          <input type="hidden" name="product_delivery_charge" value="0" required />
          <input type="hidden" name="success_url" value="http://localhost:9000/api/order/success" required />
          <input type="hidden" name="failure_url" value="https://developer.esewa.com.np/failure" required />
          <input type="hidden" name="signed_field_names" value="total_amount,transaction_uuid,product_code" required />
          <input type="hidden" name="signature" value={hashInBase64} required />

          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl text-lg font-medium transition duration-200"
          >
            Pay with eSewa
          </button>
        </form>

        <button
          onClick={() => navigate("/cart")}
          className="w-full mt-4 border border-gray-400 text-gray-600 hover:bg-gray-100 py-2 rounded-xl transition duration-200"
        >
          Cancel and Return to Cart
        </button>
      </div>
    </div>
  );
}

export default Payment;
