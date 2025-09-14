const mongoose =require("mongoose");

const connecToDb = async()=>{
    try {
        await mongoose.connect((process.env.MONGO_URI))
        console.log("connected to DB");
        
    } catch (error) {
        console.log("Failed to connect");
        
    }
}
module.exports=connecToDb