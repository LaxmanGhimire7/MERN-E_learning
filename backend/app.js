require("dotenv").config();
require("./src/Scheduler/emailReminder.js");

const express = require("express");
const app = express();  
const cors = require("cors");
const path = require("path")

const connectDb = require("./src/Db/config");
connectDb();

const userRoutes = require("./src/Routes/userRoutes.js");
const courseRoutes = require("./src/Routes/courseRoutes.js");
const contactRoutes = require("./src/Routes/contactRoute.js")
const courseOrderRoutes = require("./src/Routes/courseOrderRoutes.js");
const studentRoutes = require("./src/Routes/studentRoutes.js");
const testimonialRoutes = require("./src/Routes/testimonialRoutes.js");
const assignmentRoutes = require("./src/Routes/assignmentRoutes");
const assignmentSubmissionRoutes = require("./src/Routes/assignmentSubmissionRoutes.js")

// Middleware
app.use(cors()); // 
app.use(express.json());

// API Routes
app.use("/api/auth", userRoutes);
app.use('/image',express.static('public/upload'));
app.use("/api/course", courseRoutes );
app.use("/api/contact", contactRoutes);
app.use("/api/order",courseOrderRoutes );
app.use("/api/student", studentRoutes);
app.use("/api/testimonial", testimonialRoutes);
app.use("/api/assignment", assignmentRoutes);
app.use("/api/assignmentSubmission", assignmentSubmissionRoutes);
app.use("/assignment", express.static(path.join(__dirname, "public", "upload")));


const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
