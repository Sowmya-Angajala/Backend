const express =require("express");
const connecToDb=require("./configs/mongodbConfig")
//Step 1:basic express setup
//step2:connecting mongodb with nodejs
//Step3:creating schema and model
//Step4: 
const app=express()
app.use(express.json());
connecToDb()




app.get("/test",(res,req)=>{
    res.send("This is test route")
})
app.listen(3000,()=>{
    console.log("Server Started at 3000 port");
    
})