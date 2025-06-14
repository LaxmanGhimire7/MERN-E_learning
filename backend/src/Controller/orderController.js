const Order = require("../Model/orderModel");

const createOrder = (req, res)=>{
    const userId = req.user._id;
    console.log(userId)
}


module.exports={createOrder}