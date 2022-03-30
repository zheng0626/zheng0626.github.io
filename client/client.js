// socket.io
io = require('socket.io-client');

const socket = io('http://localhost:3000');

socket.on("connect",()=>{
  console.log("IM AM A CLIENT");
})