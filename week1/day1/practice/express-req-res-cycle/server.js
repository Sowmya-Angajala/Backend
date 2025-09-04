const express =require("express");

const app=express();


//this function parses the json body
app.use(express.json());

// create a route

app.get("/test",(req,res)=>{
    res.send("this is test route")
});

app.get("/test1",(req,res)=>{
    res.send(`<h1>this is test route</h1>`)
});


//post route

app.post("/add-data",(req,res)=>{
    console.log(req.body)
    res.send("Data added")
})

//put route for update
app.put("/update-data",(req,res)=>{
    console.log(req.body)
    res.send("Data updated")
})

app.delete("/delete-data",(req,res)=>{
    console.log(req.body)
    res.send("Data deleted ")
})

app.listen(3000,()=>{
    console.log("Server Started at 3000 port");
    
})