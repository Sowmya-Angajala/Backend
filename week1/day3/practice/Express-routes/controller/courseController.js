const {getData} =require("../model/courseModel");

const getAllCourses =(req,res)=>{
    let courses=getData().courses;
    res.status(200).json({msg:"list of courses",courses});
}

const addCourse = (req, res)=>{
let  newCourse = req.body;
let data= getData().data;
let courses = getData().courses;
let id =courses [courses.length -1].id + 1;
newCourse ={...newCourse, id};
courses.push(newCourse);
data.courses= courses;
add0rUpdateCourse(data);
res.status(201).json({ msg: "New Course Added" });
};

 
module.exports = { getAllCourses,addCourse };