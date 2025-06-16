import React from 'react'
import { useParams } from 'react-router-dom';

function Success() {
  const {id}= useParams();
  const [orderDetail, setOrderDetail] = useState({});

  const getOrder = async()=>{
let response = await fetch(`http://localhost:9000/api/order/getOrder/${id}`)
response= await response.json();
  }
  return (
    <div>

      
    </div>
  )
}

export default Success;
