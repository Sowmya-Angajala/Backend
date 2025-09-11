const mongoose = require("mongoose")
const userSchema =new mongoose.Schema({
    name:String,
    email:String,
    age:Number,
    gender:String
})

const UserModel =mongoose.model("User",userSchema);
module.exports=UserModel;