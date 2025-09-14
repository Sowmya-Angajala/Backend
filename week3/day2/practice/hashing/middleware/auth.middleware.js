const authMiddleware =(req,res,next)=>{
//check the token
//if token valid ,then allow next
//else send res as unauthorized


//how to send token??

console.log("passed through auth middleware");
console.log(req.header.authorization);

next()


}
module.exports=authMiddleware;