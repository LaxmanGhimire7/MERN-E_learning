import { Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import Navigation from "./NavBar/Navigation";
import AboutUs from "./Pages/AboutUs";
import ChoosingSipalaya from "./Pages/ChoosingSipalaya";
import Footer from "./Pages/Footer";
import Header from "./Pages/Header";
import Login from "./Pages/Login";
import Registration from "./Pages/Registration";
import TermsAndConditions from "./Pages/TermsAndCondition";
import UserProfile from "./Pages/UserProfile";
import Dashboard from "./Admin/Dashboard";
import UserManagement from "./Admin/UserManagement";
import CourseManagement from "./Admin/CourseManagement";
import AddCourse from "./Admin/AddCourse";
import EditCourse from "./Admin/EditCourse";
import ProtectedRoute from "./Pages/ProtectedRoutes";
import CourseDetails from "./Pages/CourseDetails";
import AdminHome from "./Admin/AdminHome";
import AllCourses from "./Pages/AllCourses";
import InstructorDashboard from "./Instructor/InstructorDashboard";
import StudentDashboard from "./Student/StudentDashboard";
import StudentHome from "./Student/StudentHome";
import InstructorHome from "./Instructor/InstructorHome";
import AddCourseDetails from "./Admin/AddCourseDetails";
import Cart from "./Pages/Cart";
import Payment from "./Pages/Payment";
import OrderHistory from "./Pages/OrderHistory";
import Contact from "./Pages/Contact";
import Success from "./Pages/Success";





function App() {
  return (
    <div>
      <Header />
      <Navigation />
      <Routes>
  {/* Public Routes */}
  <Route path="/" element={<Home />} />
  <Route path="/aboutus" element={<AboutUs />} />
  <Route path="/allCourses" element={<AllCourses />} />
  <Route path="/userProfile" element={<UserProfile />} />
  <Route path="/cart" element={<Cart />} />
  <Route path="/payment" element={<Payment />} />
  <Route path="/OrderHistory" element={<OrderHistory />} />
  <Route path="/Contact" element={<Contact />} />
  <Route path="/students-login" element={<Login />} />
   <Route path="/CourseDetails/" element={<CourseDetails />} />
  <Route path="/registration" element={<Registration />} />
  <Route path="/success/:id" element={<Success />} />
  <Route path="/choosingSipalaya" element={<ChoosingSipalaya />} />
  <Route path="/footer" element={<Footer />} />
  <Route path="/termsAndConditions" element={<TermsAndConditions />} />
 

  {/* Admin Protected Routes */}
  <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
    <Route path="/dashboard" element={<Dashboard />}>
      <Route index element={<AdminHome />} />
      <Route path="adminHome" element={<AdminHome />} />
      <Route path="course" element={<CourseManagement />} />
      <Route path="user" element={<UserManagement />} />
      <Route path="course/addCourse" element={<AddCourse />} />
      <Route path="course/editCourse" element={<EditCourse />} />
      <Route path="course/AddCourseDetails" element={<AddCourseDetails />} />
    </Route>
  </Route>

  {/* Instructor Protected Routes */}
  <Route element={<ProtectedRoute allowedRoles={['instructor', 'admin']} />}>
    <Route path="/instructor-dashboard" element={<InstructorDashboard />}>
      <Route index element={<InstructorHome/>} />
    </Route>
  </Route>

  {/* Student Protected Routes */}
  <Route element={<ProtectedRoute allowedRoles={['student', 'admin', 'instructor']} />}>
    <Route path="/student-dashboard" element={<StudentDashboard />}>
      <Route index element={<StudentHome />} />
      <Route path="home" element={<StudentHome/>}/>
    </Route>
  </Route>
</Routes>


      
    </div>
  );
}

export default App;
