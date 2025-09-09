const express =require("express")

const lectureRouter=express.Router();



 
lectureRouter.get("/all-lectures",(req,res)=>{
    res.status(200).json({msg:"List of lectures"})
})

lectureRouter.post("/add-lecture",(req,res)=>{
    res.status(201).json({msg:"lecture-added"});
})

lectureRouter.put("/update-lecture/:id",(req,res)=>{
    res.status(201).json({msg:"lecture updated"})
})

lectureRouter.delete("/delete-lecture/:id",(req,res)=>{
    res.status(201).json({msg:"lecture deleted"})
})


module.exports =lectureRouter;
  