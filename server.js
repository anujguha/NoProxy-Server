const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json()
const http = require('http').Server(app);
const cors = require('cors');
const io = require('socket.io')(http,{
    cors:{
        origin:"http://localhost:3000"
    }
});
var path =  require('path');
const port = process.env.PORT || 5001;

const fs = require("fs");

const users = require("./list.json");
//delete users.enrollment;
//delete users.class;
app.use(cors());


app.get("/faculty", (req,res)=>{
    
    res.sendFile(__dirname + '/list.json');  
});

var stdip = 0;
var facip = 0;
app.post("/faculty/create",jsonParser, function(req,res){
    console.log(req.body);
    facip = req.socket.remoteAddress;
    servercreate();
    res.json({message: "Server Created"})

});
app.post("/student",jsonParser, function(req,res){
    console.log(req.body);
    stdip = req.socket.remoteAddress;
});
app.post("/faculty/end",jsonParser, function(req,res){
    console.log(req.body);
    serverend();
    res.json({message: "Server Ended"})

});

let user= {
    enrollment: "",
    class: "",
}
//socket
function servercreate() {io.on('connection', (socket) => {
    console.log("User Connected")
    socket.on('enrollment', msg => {
        console.log(msg)
        if(stdip === facip){
        user = {
            enrollment: msg.Enrollment,
            class: msg.Class,
            
        };
        users.push(user);
        socket.emit('SENT','Enrollment Accepted')
    }
        
    });
    socket.on('disconnect', function (){
        console.log("User disconnected")
    })
  })};
function serverend() {
    fs.writeFile("list.json", JSON.stringify(users), err =>{
        if(err) throw err ;
        console.log('done writing');
    });
}

app.listen(5000, () => {
    console.log("server started on port 5000")
});

http.listen(port, () => {
    console.log(`Socket.IO server running at http://localhost:${port}/`);
  });