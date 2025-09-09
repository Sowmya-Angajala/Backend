const express =require("express");

const fs=require("fs");
const courseRouter = require("./routes/courseRoutes");
const lectureRouter = require("./routes/lectureRoutes");

const app=express();
app.use(express.json());

//course route
app.use("/courses",courseRouter)

//lecture route
app.use("/lectures",lectureRouter)


app.listen(3000,()=>{
    console.log("Server started at 3000 port");
})