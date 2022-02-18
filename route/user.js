var express = require('express');
var router = express.Router();
var authen = require('../controllers/authenticate');

/* GET users listing. */

router.get('/', function (req, res, next) {
    res.render('./index', { error: false });
});

router.get('/signin',(req,res)=>{
    console.log("HELLO");
    res.render('signin');
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