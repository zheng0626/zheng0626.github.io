const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const db = require('./db');
const md5 = require('md5');
const session = require('express-session');
const customeFields = {
  usernameField: 'username',
  passwordField:'password'
}

const verifyCallBack = (username,password,done)=>{
  var x = (new Date()).getTimezoneOffset() * 60000; 
  var timestamp = new Date(Date.now() - x).toISOString().slice(0, 19).replace('T', ' ');
  db.getUserUsername(username).then((user)=>{
    if(!user) {return done(null,false)}

    if(md5(password) == user.password){
      db.updateLoginUserTime(user.id,timestamp).then(()=>{
        return done(null,user);
      });
      return done(null,user);
      return res.redirect('/admin/home');
  }else{
    return done(null,false);
    return res.redirect('/');
  }
  })
  .catch((err)=>{
    done(err);
  })
}

const strategy = new LocalStrategy(customeFields,verifyCallBack);

passport.use(strategy);

passport.serializeUser((user,done)=>{
  done(null,user.id);
});

passport.deserializeUser((userId,done)=>{
  db.getUserById(userId).then((user)=>{
    done(null,{id:user[0].id,name:user[0].username,isStaff:user[0].isStaff});
  })
  .catch(err=>done(err))
});