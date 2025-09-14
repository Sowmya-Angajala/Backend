const express =require("express");
const authMiddleware = require("../middleware/auth.middleware");

const TodoRouter=express.Router();


TodoRouter.post("/add-todo", authMiddleware , async (req,res)=>{



    const todos=userModel.create



    try {
        let todo =await TodoRouter.create()
    } catch (error) {
            res.status(500).json({messgage :"something went wrong"})
    }
})
module.exports =TodoRouter;