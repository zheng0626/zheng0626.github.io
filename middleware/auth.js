module.exports.isAuth = (req,res,next) =>{
  if(1){
    next();
  }else{
    res.status(400).redirect('/');
  }
}

