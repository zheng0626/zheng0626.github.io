// Controller for staff Management page
const db = require('../config/db');
const md5 = require('md5');
let staffController = {};

staffController.staffPage_get = async(req,res)=>{
  var allUser = await db.getAllUser();
  res.render('staff/manageStaff',{
    users : allUser
  });
}

staffController.viewSpecificStaff_get = async(req,res)=>{
  var id = req.params.id;
  var getUser = await db.getUserById(id);
  res.json({
    user:getUser[0]
  });
}

staffController.addStaff_post = async(req,res)=>{
  let name = req.body.name_field;
  let username = req.body.username_field;
  let password = req.body.password_field;
  password = md5(password);
  await db.addUser(name,username,password,1);
  res.redirect('/user/manage-staff');
}

staffController.modifyStaff_post = async(req,res)=>{
  var id = req.params.id;
  let name = req.body.name_field;
  let username = req.body.username_field;
  await db.updateUserById(id,name,username);
  res.redirect('/user/manage-staff')
}

staffController.deleteStaff_post = async(req,res)=>{
  var id = req.params.id;
  await db.deleteUserById(id);
  res.json({msg:'success'});
}

module.exports = staffController;