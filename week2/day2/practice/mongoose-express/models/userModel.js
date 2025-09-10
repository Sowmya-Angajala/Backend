const mongoose =require("mongoose");

//Create Schema i.e Structure/blueprint
const userSchema =new mongoose.Schema({
    name:String,
    age:Number,
    location:String,
    isMarried:Boolean,
})

//Create Model ,Model i responsible to interact with DB
const UserModel =mongoose.model("User",userSchema);


module.exports =UserModel;