var socket = io();

socket.on('new order', () => {
  console.log('copy!')
  location.reload();
});

socket.on('cancel order request',function(collectNum,order_id){
  let confirmAction = confirm(`Cancellation Request! Collection Num : ${collectNum}`);
  console.log("Did i called?");
  if(confirmAction){
    var msg = "Accepted";
    socket.emit('cancel order request reply',order_id,msg);
    location.reload();
  }
})

// let toggle = document.querySelector('.toggle');
// let navigation = document.querySelector('.orderSummary');
// let main = document.querySelector('.main')
// toggle.onclick = function(){
// navigation.classList.toggle('active');
// main.classList.toggle('active');
// }

function formatAMPM(date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var seconds = date.getSeconds();
  var ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0'+minutes : minutes;
  var strTime = hours + ':' + minutes + ':' + seconds;
  return strTime;
}

getCurrentTime = () =>{
  var x = (new Date()).getTimezoneOffset() * 60000; 
  var timestamp = new Date(Date.now() - x).toISOString().slice(0, 19).replace('T', ' ');
  document.getElementById('time').innerHTML = formatAMPM(new Date);
}
getCurrentTime();
setInterval(getCurrentTime,1000);


$(function(){
  $('.order').on('click',function(){
    $(this).find($('.orderOption')).removeClass('hidden');
  })

  $('.orderOption .returnBtn').on('click',function(event){
    $(this).parents('.orderOption').addClass('hidden');
    event.stopPropagation();
  })

  $('.doneBtn').on('click',function(){
    let order_id = $(this).attr('order_id');
    console.log(order_id);
    $.ajax({
      url:`home/order/${order_id}/1/updateOrderStatus`,
      method:'post',
        success:(res)=>{
          if(res.msg="success"){
            $(this).parents('.order').addClass('hide');
          }else{
            alert('some error occured try again');
          }
        },
        error:(res)=>{
          alert('server error occured');
        }
      })
  })
})