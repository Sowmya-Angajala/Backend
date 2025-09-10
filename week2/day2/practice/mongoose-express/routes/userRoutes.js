const express =require("express");
const UserModel = require("../models/userModel");

const UserRouter =express.Router();

UserRouter.get("/", async (req,res)=>{
    //find all documentes present in User Collection through UserModel
try {  
    let users =UserModel.find({}) //Retrieves all docs from user collection
     res.status(200).json({msg:"User List",users})    
   
} catch (error) {
    res.status(500).json({msg:"something went wrong"})
}
})


//Add  user Into user Collection 

UserRouter.post("/add-user",async  (req,res)=>{
    console.log(req.body)
    let user=UserModel.create(req.body)
    res.status(201).json({msg:"User added",user});
})

//Update user by id
UserRouter.patch("/update-user/:userId",async(req,res)=>{
    const {userId} =req.params;
    let user=await UserModel.findById(userId);
    if(!user){
        res.status(404).json({"user not found"})
    }
    else{
        await UserModel.findByIdAndUpdate()
    }
})

module.exports=UserRouter;