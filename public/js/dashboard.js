$(function(){

  // $('.tableLink').on('click','tr',()=>{
  //   console.log($(this))
  //   var id = $(this).data('href');
  //   alert(id);
  // })

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