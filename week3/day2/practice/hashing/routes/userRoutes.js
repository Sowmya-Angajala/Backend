const express=require("express");
var jwt = require('jsonwebtoken');





const UserRouter =express.Router();

//signup 
//client username ,email and password from req.body

//How to hash?????
//npm bycrypt helps to hash the password 

UserRouter.post("/signup",   async (req,res)=>{
    try {
        const {username,email,password} =req.body;

        bcrypt.hash(password,setRounds,async function (err,hash){
            //store hash in your password DB
            if(err){
                res.status(500).json({message:"something went wrong"})
            }
            else{
                console.log("rawpassword->",password,"hashedpassword",hash);
                //store this in db along with other userdata
                await UserModel.create({username,email,password:hash})
                
            }

        })
    } catch (error) {
        res.status(500).json({message:"Something went wrong"})
        
    }
})

UserRouter.post("/login",async(req,res)=>{
    try {
        ///Check user is present ,
        //if no send response as signup 
        //if yes ,compare the password
        //else worng password
         const {username,email,password} =req.body;
            let user =await UserModel.findOne({email});

            if(!user){
                res.status(404).json({message:"user not found,please signup"})
            }else{
                //user found
                //if yes ,compare the password
                let hash =user.password; ///hased stored password from db
                bcrypt.compare(password,hash).then(function(result){
                    console.log(result);
                if(result==true){

                    //generate jwt and send along with it 
                    var token = jwt.sign({ userId :user._id }, 'shhhhh');
                    console.log(token)
                    res.status(200).json({message:"Login Sucess"})
                }else{
                    res.status(401).json({message:"Wrong password"})
                }
                    
                })
            }

    } catch (error) {
         res.status(500).json({message:"Something went wrong"})
    }
})
module.exports =UserRouter;

