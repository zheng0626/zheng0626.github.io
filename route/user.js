const express = require('express');
const router = express.Router();
const authen = require('../controllers/authenticate');

// further improvement for security
// const { hashSync, genSaltSync, compareSync } = require("bcrypt");

const DbService = require('../config/db');
const db = require('../config/db');
const { getIDFood, getAllCategory } = require('../config/db');
const app = express();


/* GET users listing. */

router.get('/', function (req, res, next) {
    res.render('./index', { error: false });
});

router.get('/signin',(req,res)=>{
    const {userId} = req.session;
    console.log(userId);
    console.log("HELLO");
    res.render('staff/staffLogin');
})

router.post('/signin',async (req,res)=>{
    try{
        const username = req.body.username;
        let password = req.body.password;
        user = await db.getUserUsername(username);

        if(!user){
            return res.send({
                message: "Invalid username or password"
            })
        }

        if(password == user.password){
            user.password = undefined;
            req.session.userId = user.id
            console.log(req.session.userId);
            return res.redirect('/admin/home');
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

router.get('/manage-product' ,async (req,res) =>{
  let allFood = await db.getAllFood();
  let allCategory = await db.getAllCategory();
  
  res.render('staff/manage_product',{
    products: allFood,
    categories: allCategory
  });
})

router.get('/logout', (req,res)=>{
  res.render('index');
})

router.get('/manage-product/modify/:product_id', async (req,res)=>{
  let product_id = req.params.product_id;
  let p = await getIDFood(product_id);
  let allCategory = await getAllCategory();
  res.render('staff/modifyProduct',{
    product : p,
    categories: allCategory
  });
})

router.get('/manage-product/addfood',(req,res)=>{
    res.render('addfood');  
})

router.get('/manage-product/addCategory',(req,res)=>{
  res.render('staff/addCategory');
})

router.get('/takeOrder',(req,res)=>{
  res.render('staff/orderTaking');
})

router.post('/manage-product/addCategory', async(req,res)=>{
  let catName = req.body.category_name;

  await db.addCategory(catName,null);
  let allFood = await db.getAllFood();
  let allCategory = await db.getAllCategory();
  res.render('staff/manage_product',{
    products: allFood,
    categories: allCategory
  });
  console.log("Added category");
})

router.post('/modifyProduct/:product_id', async(req,res)=>{
  let id = req.params.product_id;
  let name = req.body.title_field;
  let categoryId = req.body.category_field;
  let price = req.body.price_field;
  let prep_time = req.body.prepTime_field || null;
  let desc = req.body.desc_field || null;
  console.log(req.body);

  console.log(id,name,categoryId,price,prep_time,desc);

  await db.modifyProduct(id,name,categoryId,price);

  let allFood = await db.getAllFood();
  let allCategory = await db.getAllCategory();
  
  res.render('staff/manage_product',{
    products: allFood,
    categories: allCategory
  });
  console.log("CHANGED");
})

router.post('/addfood',(req,res) =>{
    console.log(req.body.category_field);
    // let allCategory = await db.getAllCategory();
    // let allFood = await db.getAllFood();
    res.send('success');
})


router.get('/home',async(req,res) =>{
    // res.render('home');
    res.render('staff/admin_dashboard');
    // const {userId} =req.session;
    // if(userId){
    //     try{
    //         const user = await DbService.getUser(userId);
    //         console.log(user)
    //         req.user = user;
    //         res.send(`
    //         <h1>Home</h1>
    //         <a href='/'>Main</a>
    //         <ul>
    //         <li> Name: ${user[0].first_name} </li>
    //         <li> Email:${user[0].email} </li>
    //         </ul>
    //         `)
    //     }
    //     catch(e){
    //         console.log(e);
    //     }
    // }
})


/* Login user */
// router.post('/signin/verify', function (req, res, next) {
//     console.log("verifying");
//     const username = req.body.username;
//     const password = req.body.password;
//     let loginResult = authen(username, req.body.password);
//     if (loginResult) {
//         res.render('users', {username: username});
//     }
//     else {
//         res.redirect('/');
//     }
// });


module.exports = router;