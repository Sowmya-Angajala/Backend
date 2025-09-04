const express =require("express");

const app=express();

// creating route 
app.get("/home",(req,res)=>{
    res.send("Welcome to Home Page")
})

app.get("/aboutus",(req,res)=>{
   res.send({ "message": "Welcome to About Us" });
    
})

app.get("/contactus",(req,res)=>{
    
    res.send({No:987654322});
    
})
// app.use(...) is used after all other route definitions.
//It catches any request that didn't match a previous route.

app.use((req, res) => {
  res.status(404).send('404 Not Found');
});
app.listen(3000,()=>{
    console.log("Server on the port 3000");
})