const express = require('express');
const router = express.Router();
const authen = require('../controllers/authenticate');
const Cart = require('../models/orderCart');
// further improvement for security
// const { hashSync, genSaltSync, compareSync } = require("bcrypt");

const DbService = require('../config/db');
const db = require('../config/db');
const { getIDFood, getAllCategory } = require('../config/db');
const app = express();


/* GET users listing. */

// USERS LOGING URL
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

router.get('/manage-product/addfood', async(req,res)=>{
    let allCategory = await db.getAllCategory();
    res.render('staff/modifyProduct',{
      categories : allCategory
    });  
})



router.get('/manage-product/addCategory',(req,res)=>{
  res.render('staff/addCategory');
})

router.get('/takeOrder', async(req,res)=>{
  let allFood = await db.getAllFood();
  let allCategory = await db.getAllCategory();
  var cart = new Cart(req.session.cart ? req.session.cart : {});
  res.render('staff/orderTaking',{
    products_in_order: cart.generateArray(),
    total_price: cart.getTotalPrice(),
    products : allFood,
    categories : allCategory
  });
})

router.get('/takeOrder/add-to-cart/:id', async (req,res) =>{
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});
  
  // var product = await db.getIDFood(productId);
  // cart.add(product[0]);

  await db.getIDFood(productId).then((product)=>{
    cart.add(product[0]);
    req.session.cart = cart;
    req.session.save(()=>{
      res.redirect('/admin/takeOrder');
    })
  });
})

router.get('/takeOrder/cancelOrder',(req,res)=>{
  var cart = new Cart(req.session.cart ? req.session.cart : {});
  cart.cancel();
  req.session.cart = cart;
  req.session.save(()=>{
    res.redirect('/admin/takeOrder');
  })
})

router.get('/takeOrder/checkout',async (req,res)=>{
  var cart = req.session.cart;
  var payNow = true;
  if(cart.products == undefined){
    console.log("EMPTY CART");
    console.log("Failed order");
    res.redirect('/admin/takeOrder');
  }else{
    console.log(cart);
    var order_id = await db.checkOut(cart);
    order_id = order_id['insertId'];
    // console.log(order_id);
    if(!payNow){
      await db.transaction(id['insertId']);
    }
    for (const [key,value] of Object.entries(cart.products)){
      await db.setOrderDetails(order_id,key,value['qty'],value['price']);
    }
    var x = (new Date()).getTimezoneOffset() * 60000; 
    // var timestamp = new Date().toUTCString().slice(0, 19).replace('T', ' ');
    var timestamp = new Date(Date.now() - x).toISOString().slice(0, 19).replace('T', ' ');

    await db.transaction(order_id,0,timestamp,null);

    req.session.cart = {};
    req.session.save(()=>{
      console.log("SUCCESS ORDER");
      res.redirect('/admin/takeOrder');
    });
  }
})

router.post('/manage-product/addCategory', async(req,res)=>{
  let catName = req.body.category_name;

  await db.addCategory(catName,null);
  res.redirect('/admin/manage-product');
  // let allFood = await db.getAllFood();
  // let allCategory = await db.getAllCategory();
  // res.render('staff/manage_product',{
  //   products: allFood,
  //   categories: allCategory
  // });
})

router.post('/manage-product/addProduct',async(req,res)=>{
  let product_id = null;
  let name = req.body.title_field;
  let categoryId = req.body.category_field;
  let price = req.body.price_field;
  let prep_time = req.body.prepTime_field || null;
  let desc = req.body.desc_field || null;

  await db.addProduct(product_id,name,categoryId,price,prep_time,desc);
  res.redirect('/admin/manage-product');
})

router.post('/modifyProduct/modify/:product_id', async(req,res)=>{
  let id = req.params.product_id;
  let name = req.body.title_field;
  let categoryId = req.body.category_field;
  let price = req.body.price_field;
  let prep_time = req.body.prepTime_field || null;
  let desc = req.body.desc_field || null;


  await db.modifyProduct(id,name,categoryId,price);

  res.redirect('/admin/manage-product');
})



router.get('/home',async(req,res) =>{
    waiting_orders = await db.getWaitingOrder();
    ten_order_history = await db.getTenOrderHistory();
    res.render('staff/admin_dashboard',{
      WO : waiting_orders,
      TOH : ten_order_history
    });
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