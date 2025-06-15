import { useState } from "react"
import { AuthContext } from "../Context/AuthProvider";
import { useContext } from "react";


function OrderHistory() {
  const [order, setOrder] = useState([]);
  const {state} = useContext(AuthContext);

  const getUserOrder = async ()=>{
    let response = await fetch("http://localhost:9000/api/order/getUserOrder",{
      method:"GET",
      headers:{
        Authorization: `Bearer ${state.token}`,
      },
    });
    response = await response.json();
    console.log(response)
  }
  return (
    <div>
     
      
    </div>
  )
}

export default OrderHistory
