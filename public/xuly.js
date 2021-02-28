
var socket = io("http://localhost:5000");

const chatForm = document.getElementById('chat-form');
const chatMessage = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const listUsers = document.getElementById('users');
//Get user and room from URL
const { username, room } = Qs.parse(location.search,{
  ignoreQueryPrefix: true
});

//Join room
socket.emit('joinRoom',{username,room});

//Get RoomName and All Username
socket.on("information",function({room,users}){
  outputRoomName(room);
  outputUsers(users);
})
//Create srocll
socket.on("messages",function(message){
   console.log(message);
   outPutMessage(message);
   //scroll down
   chatMessage.scrollTop = chatMessage.scrollHeight;
  });

//Send Message
 chatForm.addEventListener('submit',function(e){
   e.preventDefault();

   //get Message
   const msg = e.target.elements.msg.value;
   //Send mess to Server
   socket.emit('chatMessage',msg);
  //clear input
  e.target.elements.msg.value ='';
  e.target.elements.msg.focus();
 })

 //output message
 function  outPutMessage(message){
   const div = document.createElement('div');
   div.classList.add('message');
   div.innerHTML =`<p class="meta">${message.username} <span>${message.time}</span></p>
   <p class="text">
    ${message.text}
   </p>
   `;
   document.querySelector('.chat-messages').appendChild(div);
 }
 //output roomName
 function outputRoomName(room){
   roomName.innerText = room;
 }
 //output Users
 function outputUsers(users){
  listUsers.innerHTML = `
  ${users.map(user => `<li>${user.username}</li>`).join('')}
  `;
}