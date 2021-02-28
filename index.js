var express = require("express");
var app = express();
app.use(express.static("public"));//request customer send ,find in "public"
app.set("view engine","ejs");
app.set("views","./views");
var qs = require('qs');
var assert = require('assert');
var server = require("http").Server(app);
var io =  require("socket.io")(server)
const formatMessage = require('./public/ulti/message');
const {userJoin,getCurrentUser,userLeave,getRoomUsers} = require('./public/ulti/user');

server.listen(5000);

io.on("connection",function(socket){
    socket.on('joinRoom',function({username,room}){
        const user = userJoin(socket.id,username,room);
        socket.join(user.room);
        socket.emit("messages",formatMessage("Admin ","Welcome to Chat App"));
        socket.broadcast.to(user.room).emit("messages",formatMessage("Admin ",`${user.username} join a chat`));
            //Information of room and users
        io.to(user.room).emit('information',{
            room: user.room,
            users: getRoomUsers(user.room)
        });
        socket.on("disconnect",function(){
            const user = userLeave(socket.id);
            if(user){
               io.to(user.room).emit("messages",formatMessage("Admin ",`${user.username} leave a chat`));
               io.to(user.room).emit('information',{
                room: user.room,
                users: getRoomUsers(user.room)
                });
            }
         
        })
    })
   
    //Listen message
    socket.on("chatMessage",function(message){
        const user = getCurrentUser(socket.id);
        io.to(user.room).emit("messages",formatMessage(user.username,message));
        // socket.emit("messages",formatMessage("User ",message));
    });

   
});


app.get("/",function(req,res){
    res.render("trangchu");
});
app.get("/chat",function(req,res){
    res.render("chat");
});
