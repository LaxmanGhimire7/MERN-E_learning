import { Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import Navigation from "./NavBar/Navigation";
import AboutUs from "./Pages/AboutUs";
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
import Partnership from "./Pages/Partnership";
import TeachingMethodologies from "./Pages/TeachingMethodologies";
import AddTestimonial from "./Student/AddTestimonial";
import ManageTestimonials from "./Admin/ManageTestimonials";
import ApprovedTestimonials from "./Pages/ApprovedTestimonials";
import CreateAssignment from "./Instructor/CreateAssignment";
import StudentAssignments from "./Student/StudentAssignments";
import InstructorSubmissions from "./Instructor/InstructorSubmissions";
import InstructorAssignmentList from "./Instructor/InstructorAssignmentList";
import StudentSubmissions from "./Student/StudentSubmissions";
import ForgotPassword from "./Pages/ForgotPassword";

function App() {
  return (
    <div>
      <Header />
      <Navigation />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/aboutus" element={<AboutUs />} />
        <Route path="/allCourses" element={<AllCourses />} />
        <Route path="/userProfile" element={<UserProfile />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/partnership" element={<Partnership />} />
        <Route
          path="/teachingMethodologies"
          element={<TeachingMethodologies />}
        />
        <Route path="/OrderHistory" element={<OrderHistory />} />
        <Route path="/Contact" element={<Contact />} />
        <Route path="/students-login" element={<Login />} />
        <Route path="/CourseDetails/" element={<CourseDetails />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/success/:id" element={<Success />} />
        <Route path="/footer" element={<Footer />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/termsAndConditions" element={<TermsAndConditions />} />
        <Route
          path="/approvedTestimonials"
          element={<ApprovedTestimonials />}
        />

        {/* Admin  */}
        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route path="/dashboard" element={<Dashboard />}>
            <Route index element={<AdminHome />} />
            <Route path="adminHome" element={<AdminHome />} />
            <Route path="course" element={<CourseManagement />} />
            <Route path="user" element={<UserManagement />} />
            <Route path="course/addCourse" element={<AddCourse />} />
            <Route path="course/editCourse" element={<EditCourse />} />
            <Route
              path="course/AddCourseDetails/:courseId"
              element={<AddCourseDetails />}
            />
            <Route path="manageTestimonials" element={<ManageTestimonials />} />
          </Route>
        </Route>

        {/* Instructor  */}
       <Route element={<ProtectedRoute allowedRoles={["instructor", "admin"]} />}>
          <Route path="/instructor-dashboard" element={<InstructorDashboard />}>
            <Route index element={<InstructorHome />} />
            <Route path="instructorHome" element={<InstructorHome />} />
            <Route path="createAssignment" element={<CreateAssignment />} />
            <Route path="assignments" element={<InstructorAssignmentList />} />
            
            <Route path="instructorSubmissions/:assignmentId" element={<InstructorSubmissions />} />
          </Route>
        </Route>

        {/* Student  */}
        <Route
          element={
            <ProtectedRoute allowedRoles={["student", "admin", "instructor"]} />
          }
        >
          <Route path="/student-dashboard" element={<StudentDashboard />}>
            <Route index element={<StudentHome />} />
            <Route path="home" element={<StudentHome />} />
            <Route path="addTestimonial" element={<AddTestimonial />} />
            <Route path="studentAssignment" element={<StudentAssignments />} />
            <Route path="studentSubmissions" element={<StudentSubmissions />} />
          </Route>
        </Route>
      </Routes>
    </div>
  );
}

export default App;
