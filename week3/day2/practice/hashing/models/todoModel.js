const mongoose=requre("mongoose");

const todoSchema =new mongoose.Schema({
    title :{type:String,required:true},
    status:{type:String,default:false},
    userId:{type:mongoose.Schema.Types.ObjectId,ref:"User"},
})