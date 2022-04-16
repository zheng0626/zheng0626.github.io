module.exports.isAuth = (req,res,next) =>{
  if(req.isAuthenticated() && req.user.isStaff){
    next();
  }else{
    res.redirect('/');
  }
}