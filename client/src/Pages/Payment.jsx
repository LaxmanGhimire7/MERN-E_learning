import { useLocation } from "react-router-dom";
import CryptoJS from "crypto-js";

function Payment() {
  const info = useLocation();
  console.log(info.state);

  const { orderId, totalAmount, totalItem } = info.state;
  let transaction_uuid = orderId; 
  console.log(transaction_uuid);

  let Message = `total_amount=${totalAmount},transaction_uuid=${transaction_uuid},product_code=EPAYTEST`;
  var hash = CryptoJS.HmacSHA256(Message, "8gBm/:&EnhH.1/q");
  var hashInBase64 = CryptoJS.enc.Base64.stringify(hash);

  return (
    <div>
      <form
        action="https://rc-epay.esewa.com.np/api/epay/main/v2/form"
        method="POST"
      >
        <input
          type="hidden"
          id="amount"
          name="amount"
          value={totalAmount}
          required
        />
        <input
          type="hidden"
          id="tax_amount"
          name="tax_amount"
          value="0"
          required
        />
        <input
          type="hidden"
          id="total_amount"
          name="total_amount"
          value={totalAmount}
          required
        />
        <input
          type="hidden"
          id="transaction_uuid"
          name="transaction_uuid"
          value={transaction_uuid}
          required
        />
        <input
          type="hidden"
          id="product_code"
          name="product_code"
          value="EPAYTEST"
          required
        />
        <input
          type="hidden"
          id="product_service_charge"
          name="product_service_charge"
          value="0"
          required
        />
        <input
          type="hidden"
          id="product_delivery_charge"
          name="product_delivery_charge"
          value="0"
          required
        />
        <input
          type="hidden"
          id="success_url"
          name="success_url"
          value="http://localhost:9000/api/order/success"
          required
        />
        <input
          type="hidden"
          id="failure_url"
          name="failure_url"
          value="https://developer.esewa.com.np/failure"
          required
        />
        <input
          type="hidden"
          id="signed_field_names"
          name="signed_field_names"
          value="total_amount,transaction_uuid,product_code"
          required
        />
        <input
          type="hidden"
          id="signature"
          name="signature"
          value={hashInBase64}
          required
        />

        <div className="shadow-2xl shadow-black mt-10 p-5 rounded-2xl">
          <h1> Total Amount : NRs.{totalAmount}</h1>
          <h1>Total Item :{totalItem}</h1>
          <input
            className="bg-orange-500 rounded-2xl py-2 px-3 ml-10 mt-4 text-white"
            value="Payment"
            type="submit"
          />
        </div>
      </form>
    </div>
  );
}

export default Payment;
