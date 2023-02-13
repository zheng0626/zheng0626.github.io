var socket = io();

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

  $('#generateTimeBtn').on('click',()=>{
    console.log("sohai");
    $.get('takeOrder/getRecommendTime',function(data){
      if(data.msg != "0"){
        let time = (data.msg).substring(0,5);
        alert(`Optimal time found: ${time}`);
        $('#timepicker').val(time);
      }else{
        alert("No optimal time available");
        $('#timepicker').val("4:30");
      }
    })
  })

  $('.orderBtn').on('click',()=>{
    socket.emit('new order');
  })

  $('input.timepicker').timepicker({
    timeFormat: 'H:mm',
    interval: 10,
    minTime: '12:00',
    maxTime: '22:00',
    defaultTime: '12:00',
    startTime: '12:00',
    dynamic: false,
    dropdown: true,
    scrollbar: true
  });

  $('.cancelBtn').on('click', ()=>{
    var time = 'WalkIn';
    $.ajax({
      url:'takeOrder/setCollectionTime',
      method:'post',
      dataType:'json',
      data:{'collectionTime':time},
      success: (res) =>{
        if(res.msg="success"){
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

  $('.proceedBtn').on('click', ()=>{
    var time = $("#timepicker").val();
    $.ajax({
      url:'takeOrder/setCollectionTime',
      method:'post',
      dataType:'json',
      data:{'collectionTime':time},
      success: (res) =>{
        if(res.msg="success"){
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
