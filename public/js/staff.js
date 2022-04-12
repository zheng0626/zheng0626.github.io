var password = document.getElementById("passwordInput")
, confirm_password = document.getElementById("rePasswordInput");
var temp_staff_id;
function validatePassword(){
  if(password.value != confirm_password.value) {
    confirm_password.setCustomValidity("Passwords Don't Match");
  } else {
    confirm_password.setCustomValidity('');
  }
}

password.onchange = validatePassword;
confirm_password.onkeyup = validatePassword;

$(function(){
  $('#addStaffBtn').on('click',function(){
    // temp_order_link = $(this).data('href');
    // temp_order_id = $(this).attr('order_id');
    // temp_collectNum = $(this).attr('collect_num');
    // console.log(temp_order_id);
    $('#staffAddForm').removeClass('hide');
    // $('#orderOption').removeClass('hide');
  });

  $('#addFormExitIcon').on('click',function(){
    $('#staffAddForm').addClass('hide');
  })

  $('#modifyFormExitIcon').on('click',function(){
    $('#staffModifyForm').addClass('hide');
  })

  $('tbody tr').on('click',function(){
    temp_staff_id = $(this).data('staff_id');
    $('#staffModifyForm').removeClass('hide');
    $.get(`manage-staff/${temp_staff_id}`,function(data){
      console.log(data.user.username);
      $('#modifyTitle').val(data.user.username);
      $('#modifyName').val(data.user.name);
      form_attr = $('#modifyUserForm').attr('action');
    })
  })

  $('#modifyUserForm').on('submit',function(){
    form_attr = $('#modifyUserForm').attr('action');
    $('#modifyUserForm').attr('action',form_attr+temp_staff_id);
  })

  $('#deleteStaffBtn').on('click',function(){
    $.ajax({
      method:'post',
      dataType: "json",
      url:`manage-staff/deleteStaff/+${temp_staff_id}`,
      success:(res)=>{
        if(res.msg="success"){
          alert("User Deleted");
          location.reload();
        }else{
          alert('some error occured try again');
        }
      },
      error:(res)=>{
        alert('server error occured!!!');
      }
    })
  })

  // $("tbody tr").on('mouseover', 
  //   function () { $(this).find("td:not(:last-child)").removeClass('hoverclass');
  // console.log("HOVERED") }
  // );

})