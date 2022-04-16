

$(document).ready(function(){

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


  $('.switchLoginBtn').on('click',function(){
    userLogin = $(this).data('user');
    console.log(userLogin); 
    if(userLogin == "staff"){
      $('#cutomerLoginDiv').addClass('hide');
      $('#staffLoginDiv').removeClass('hide');
    }else if(userLogin == 'customer'){
      $('#staffLoginDiv').addClass('hide');
      $('#cutomerLoginDiv').removeClass('hide');
    }
  })

  $('#register').on('click',function(){
    $('#cutomerLoginDiv').addClass('hide');
    $('#staffLoginDiv').addClass('hide');
    $('#cutomerRegisterDiv').removeClass('hide');
  })

});