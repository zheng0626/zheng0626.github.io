// Controller for managing login or register user
const db = require('../config/db');
const md5 = require('md5');
let authenticateController = {};
const passport = require('passport');

authenticateController.singinPage_get = (req,res)=>{
  res.render('staff/staffLogin');
}

authenticateController.register_post = async (req,res)=>{
  let name = req.body.name_field;
  let username = req.body.username_field;
  let password = req.body.password_field;
  password = md5(password);

  await db.addUser(name,username,password,0);
  passport.authenticate('local', { failureRedirect: '/', successRedirect: '/user/home' });
  res.redirect('/');
}

authenticateController.logout_get = (req,res)=>{
  req.logout();
  res.redirect('/');
}


module.exports=authenticateController;