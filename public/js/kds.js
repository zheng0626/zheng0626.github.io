var socket = io();

socket.on('new order', () => {
  console.log('copy!')
  location.reload();
});

socket.on('cancel order request',function(collectNum,order_id){
  let confirmAction = confirm(`Cancellation Request! Collection Num : ${collectNum}`)
  if(confirmAction){
    var msg = "Accepted";
    socket.emit('cancel order request reply',order_id,msg);
    location.reload();
  }else{
    var msg = "Declined";
    socket.emit('cancel order request reply',order_id,msg);
  }
})

let toggle = document.querySelector('.toggle');
let navigation = document.querySelector('.orderSummary');
let main = document.querySelector('.main')
toggle.onclick = function(){
navigation.classList.toggle('active');
main.classList.toggle('active');
}
getCurrentTime = () =>{
  var x = (new Date()).getTimezoneOffset() * 60000; 
  // var timestamp = new Date().toUTCString().slice(0, 19).replace('T', ' ');
  var timestamp = new Date(Date.now() - x).toISOString().slice(0, 19).replace('T', ' ');
  document.getElementById('time').innerHTML = timestamp; 
}
getCurrentTime();
setInterval(getCurrentTime,1000);
