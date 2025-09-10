const mongoose =require("mongoose");

//establish a connection with MongoDB

const connecToDb =async()=>{
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/backendTest"); //mongoURL 
        console.log("Connected to db");
    } catch (error) {
        console.log("Error in connecting DB");
        console.log(err);
        
    }
}
connecToDb();

//create a schema
//schema is basic structure/blueprint of how typical document should look

const userSchema =new mongoose.Schema({
    name:String,
    age:Number,
    location:String,
    isMarried:Boolean,
})

//Schema just helps to maintain structure
//Model is responsible to interact with DB
//Model is constructor which connects Collections and Schema

const UserModel =mongoose.model("User",userSchema);
//User --collection name
//userSchema --schema

//make a typical interaction with DB 

//Method 1 . using create()

// UserModel.create({name:"Sumi",age:23,location:"Kerala",isMarried:false}).then(()=>{
// console.log("Data added in db under collection user in db backendtest");
    
// })
//there is no insertOne in mongoose
//using .create() or new .save()


//Method2 ,new -  .save()
 
let newUser =new UserModel({name:"nikhil",age:23,location:"kerala",isMarried:false})
newUser.save().then(()=>{
    console.log("Data Added");
    
}).catch((err)=>{
    console.log("error ",err);  
})

//Printing all available data in console

let users=UserModel.find();
users.then((data)=>{
    console.log(data);
}).catch((err)=>{
    console.log("error in getting data",err);
})

//updating the user

let updatedData=UserModel.findByIdAndUpdate("68c124685b80aeb795744b7c",{name:"Nikhil Krishna"})
updatedData.then(()=>{
    console.log("Updated data");
}).catch((err)=>{
    console.log("err in updating user",err);
    
})

