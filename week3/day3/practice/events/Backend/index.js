const express =require ("express");

const http =require("http");

const{ Server } =require("socket.io");

const app =express(); //app is used to apply middlewae
const server=http.createServer(app);
//http can not be skipped,as socket protocol upgradations happens in http

app.use(cors);
const io=new Server(server);

//io is main chat server which establishes continuous connection


//creating the first connection event
//io is responsible to get client connected
//.on is vevent listener which listens an event called as connection

io.on("connection",(client)=>{
    console.log("client connected");
    //we can create custom customised events for client

    //This event listener which is listening to an event send ,essage
    //client (postman/frontend) can emit an event send message ,whose console will be 
    client.emit("response","Thanks for chatting")
})
server.listen(3000,()=>{
    console.log("server running at http://localhost:3000");

    
    
})