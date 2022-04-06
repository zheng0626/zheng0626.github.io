var socket = io();

socket.on('cancel order request',function(collectNum,order_id){
  let confirmAction = confirm(`Cancellation Request! Collection Num : ${collectNum}`)
  if(confirmAction){
    socket.emit('cancel order request reply',order_id);
  }
})

const tabs = document.querySelectorAll('[data-tab-target]')
const collection = document.querySelector('#category_collection')
const tabContents = document.querySelectorAll('[data-tab-content]')
const returnCat = document.querySelectorAll('#returnBtn')
tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const target = document.querySelector(tab.dataset.tabTarget)
    tabContents.forEach(tabContent => {
      tabContent.classList.remove('active')
    })
    collection.classList.remove('active')
    tab.classList.add('active')
    target.classList.add('active')
  })
})
returnCat.forEach(cat=>{
  cat.addEventListener('click',()=>{
    tabContents.forEach(tabContent => {
      tabContent.classList.remove('active')
    })
    collection.classList.add('active')
  })
})
showTimeSelection = () =>{
  document.getElementById('timeCollectionWindow').style.display = "block";
}

$(document).ready(function(){
  $('.setTime').on('click', ()=>{
    $("#timeSelectionWindow").show();
  })

  $('.orderBtn').on('click',()=>{
    socket.emit('new order');
  })

  $('input.timepicker').timepicker({
    timeFormat: 'h:mm',
    interval: 15,
    minTime: '4:30',
    maxTime: '10:00',
    defaultTime: '4:30',
    startTime: '4:30',
    dynamic: false,
    dropdown: true,
    scrollbar: true
  });

  $('.proceedBtn').on('click', ()=>{
    var time = $("#timepicker").val();
    console.log(time);
    $.ajax({
      url:'takeOrder/setCollectionTime',
      method:'post',
      dataType:'json',
      data:{'collectionTime':time},
      success: (res) =>{
        if(res.msg="success"){
          alert('task added successfully');
          $("#timeSelectionWindow").hide();
          $('.pickUpTime h3').text(`Collection: ${time}`)
        }else{
          alert('some error occured try again');
        }
      },
      error:(res)=>{
        alert('server error occured');
      }
    })
  })

});
