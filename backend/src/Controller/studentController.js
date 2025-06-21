const User = require ("../Model/userModel");

const getStudentDashboard = async (req, res)=>{
    try {
        const student = await User.findById(req.user.id).populate("enrolledCourses");
        console.log(student);
    } catch (error) {
        
    }
}


module.exports = {getStudentDashboard}