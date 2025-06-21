const CourseOrder = require("../Model/courseOrderModel");
const User = require("../Model/userModel");

const allowDashboardAccess = async (req, res, next)=>{
    try {
        const user = req.user;
    } catch (error) {
        
    }
}