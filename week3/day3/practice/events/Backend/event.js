const EventEmitter = require('events');

const event =new EventEmitter();

// .on ---> Listening to the event 
// .emit --> Triggering /Calling the event

event.on("first_event",()=>{
    console.log("This is first event");
    
})

//call/trigger the event 
event.emit("first_event")

//Sockets are part of http protocol

//whenever we use sockets
//typical http connection upgrades into socket 
//where established connection reamains alive
