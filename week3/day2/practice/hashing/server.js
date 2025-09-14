const express =require("express");
const connecToDb = require("./config/mongoDbConfig");
const UserRouter = require("./routes/userRoutes");
const TodoRouter = require("./routes/todoRoutes");
require("dotenv").config();
const PORT=process.env.PORT || 3000

const app=express();
app.use(express.json());

connecToDb

app.get("/test",(req,res)=>{
   try {
    
   } catch (error) {
    
   }
})




//User Router

app.use("/users",UserRouter)

//use TodoRouter

app.use("/todos",TodoRouter)

app.use((req,res)=>{
    try {
        res.status(200).json({message:"Req undefined"})
    } catch (error) {
        res.status(500).json({message:"something went wrong"})
    }
})
