const mongoose =require("mongoose");

const connecToDb =async()=>{
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/backendTest"); //mongoURL 
        console.log("Connected to db");
    } catch (error) {
        console.log("Error in connecting DB");
        console.log(err);
        
    }
}
module.exports=connecToDb;