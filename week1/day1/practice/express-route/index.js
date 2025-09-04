// import express
const express =require("express");

const app=express()
// importing the fs builtin module
const fs=require("fs");

//create a route 
app.get("/test",(req,res)=>{
    // req->send by the client
    //res->given by the app
    //how to give a res???
    res.send("This is a test route")
})
app.get("/home",(req,res)=>{
    res.send("This is a Home route")
})
app.get("/contactus",(req,res)=>{
    res.send("This is a contact us page")
})
app.get("/shop",(req,res)=>{
    res.send("This is a shop page")
})

//reading the file through fs module

app.get("/read",(req,res)=>{
    //by default this route will read the data.txt file
    let data=fs.readFileSync("./data.txt","utf-8")
    console.log(data)
    res.send( data)
})


app.listen(3000,()=>{
    console.log("Server started  on port 3000");   
})
