const express=require("express")

const app=express();

app.get("/users/get",(req,res)=>{
    res.send({ "id": 1,"name":"varshaa"})
})

app.get("/users/list",(req,res)=>{
    res.send([
  { "id": 1, "name": "John Doe", "email": "john@example.com" },
  { "id": 2, "name": "Jane Doe", "email": "jane@example.com" },
  { "id": 3, "name": "Bob Smith", "email": "bob@example.com" }
]
)
})

app.use((req,res)=>{
    res.status(404).send("404 Not Found");
})

app.listen(3000,()=>{
    console.log("Server on the port 3000");
})
