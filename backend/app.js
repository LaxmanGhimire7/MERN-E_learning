require("dotenv").config();

const express = require("express");
const app = express();
const cors = require("cors");

const connectDb = require("./src/Db/config");
connectDb();

const userRoutes = require("./src/Routes/userRoutes.js");
const courseRoutes = require("./src/Routes/courseRoutes.js");
const contactRoutes = require("./src/Routes/contactRoute.js")
const courseOrderRoutes = require("./src/Routes/courseOrderRoutes.js");

// Middleware
app.use(cors()); // 
app.use(express.json());

// API Routes
app.use("/api/auth", userRoutes);
app.use('/image',express.static('public/upload'));
app.use("/api/course", courseRoutes );
app.use("/api/contact", contactRoutes);
app.use("/api/order",courseOrderRoutes );



const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
