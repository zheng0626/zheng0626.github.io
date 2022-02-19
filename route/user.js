const express = require('express');
const router = express.Router();
const authen = require('../controllers/authenticate');

// further improvement for security
// const { hashSync, genSaltSync, compareSync } = require("bcrypt");

const DbService = require('../config/db');
const db = require('../config/db');
const app = express();


/* GET users listing. */

router.get('/', function (req, res, next) {
    res.render('./index', { error: false });
});

router.get('/signin',(req,res)=>{
    const {userId} = req.session;
    console.log(userId);
    console.log("HELLO");
    res.render('staffLogin');
})

router.post('/signin',async (req,res)=>{
    try{
        const username = req.body.username;
        let password = req.body.password;
        user = await DbService.getUserUsername(username);

        if(!user){
            return res.send({
                message: "Invalid username or password"
            })
        }

        if(password == user.password){
            user.password = undefined;
            req.session.userId = user.id
            console.log(req.session.userId);
            return res.redirect('/');
        }else{
            res.send(
                "Invalid username or password"
            )
        }
        return res.redirect('/');
    }catch(e){
        console.log(e);
    }
})


router.get('/home',async(req,res) =>{
    const {userId} =req.session;
    if(userId){
        try{
            const user = await DbService.getUser(userId);
            console.log(user)
            req.user = user;
            res.send(`
            <h1>Home</h1>
            <a href='/'>Main</a>
            <ul>
            <li> Name: ${user[0].first_name} </li>
            <li> Email:${user[0].email} </li>
            </ul>
            `)
        }
        catch(e){
            console.log(e);
        }
    }
})


/* Login user */
router.post('/signin/verify', function (req, res, next) {
    console.log("verifying");
    const username = req.body.username;
    const password = req.body.password;
    let loginResult = authen(username, req.body.password);
    if (loginResult) {
        res.render('users', {username: username});
    }
    else {
        res.redirect('/');
    }
});
module.exports = router;