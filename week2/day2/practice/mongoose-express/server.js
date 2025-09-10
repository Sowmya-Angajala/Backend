//Step1 basic express setup creation
//Step 2 connect MongoDB with nodejs through Mongoose 
//Step 3 :Create schema and model
//Step4 : Import model and create Route and perform CRUD operations


const express =require("express")
const connecToDb=require("./configs/mongodbConfig")
const UserRouter=require("./routes/userRoutes")

connecToDb()

const app=express()

//inbuilt middleware  -json body parser middleware
app.use(express.json())



app.use("/users",UserRouter)
app.listen(3000,()=>{
    console.log("server started....");
    
})