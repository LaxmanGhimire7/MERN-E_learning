const mongoose = require("mongoose")
const connectDb = ()=>{
    mongoose.connect("mongodb://localhost:27017/LaxmanSipalaya")
    console.log("Successfully connected to MongoDB")
}
module.exports= connectDb;