var socket = io();
var temp_order_link;
var temp_order_id;
var temp_collectNum;


$(function(){

  socket.on('cancel order request reply',function(order_id,msg){
    if(msg == 'Accepted'){
      alert(`${order_id} Cancelation accepted`);
      $.ajax({
        url:`home/order/${order_id}/2/updateCollectStatus`,
        method:'post',
        success:(res)=>{
          if(res.msg="success"){
            alert("Order Canceled");
            location.reload();
          }else{
            alert('some error occured try again');
          }
        },
        error:(res)=>{
          alert('server error occured');
        }
      })
    }else if(msg == 'Declined'){
      alert(`${order_id} Cancelation Declined`);
    }
  })

  socket.on('Order Status Changed',function(){
    setTimeout(()=>{
      location.reload();
    },500);
  })

  $('.trOrderLink tr').on('click',function(){
    temp_order_link = $(this).data('href');
    temp_order_id = $(this).attr('order_id');
    temp_collectNum = $(this).attr('collect_num');
    console.log(temp_order_id);
    $('#statusOption').addClass('hide');
    $('#orderOption').removeClass('hide');
  });

  $('.trOrderHistroy tr').on('click',function(){
    window.location.href = $(this).data('href');
  });

  $('#returnBtn').on('click',function(){
    $('#orderOption').addClass('hide');
    $('#statusOption').addClass('hide');
  });

  $('#changeStatusBtn').on('click',function(){
    $('#statusOption').removeClass('hide');
  })

  $('#viewOrderDetailBtn').on('click',function(){
    window.location.href = temp_order_link;
  })

  $('.statusOptionBtn').on('click',function(){
    var action = $(this).attr('action-id');
    console.log(action);
    if(action == 'Paid'){
      $.ajax({
        url:`home/order/${temp_order_id}/1/updatePaymentStatus`,
        method:'post',
        success:(res)=>{
          if(res.msg="success"){
            alert("Status Updated");
            let order = $(`[order_id="${temp_order_id}"]`);
            order.find('td.tdOrderStatus').text("Paid");
          }else{
            alert('some error occured try again');
          }
        },
        error:(res)=>{
          alert('server error occured');
        }
      })
    }
    else if(action == 'Collected'){
      $.ajax({
        url:`home/order/${temp_order_id}/1/updateCollectStatus`,
        method:'post',
        success:(res)=>{
          if(res.msg="success"){
            alert("Order Collected!");
            location.reload();
          }else{
            alert('some error occured try again');
          }
        },
        error:(res)=>{
          alert('server error occured');
        }
      })
    }
    else if(action == 'Cancel'){
      alert("Cancelation request sent!")
      socket.emit('cancel order request',temp_collectNum,temp_order_id);
    }
  })



});