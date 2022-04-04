const express = require('express');
const router = express.Router();
const authen = require('../controllers/authenticate');
const Cart = require('../models/orderCart');
// further improvement for security
// const { hashSync, genSaltSync, compareSync } = require("bcrypt");

const DbService = require('../config/db');
const db = require('../config/db');
const { getIDFood, getAllCategory, getIdCat } = require('../config/db');
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

router.get('/logout', (req,res)=>{
  res.render('index');
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

router.post('/takeOrder/setCollectionTime',(req,res)=>{
  // var cart = new Cart(req.session.cart ? req.session.cart : {});
  console.log(req.body.collectionTime);
  res.json({msg:'success'});
  // cart.setTime(req.body)
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

router.get('/orders', async (req,res)=>{
  let needPrepareOrder = await db.getAllNeedPrepareOrder();
  console.log(needPrepareOrder);
  res.render('staff/kvs');
})



router.get('/home',async(req,res) =>{
    waiting_orders = await db.getWaitingOrder();
    ten_order_history = await db.getTenOrderHistory();
    res.render('staff/admin_dashboard',{
      WO : waiting_orders,
      TOH : ten_order_history
    });
})

router.get('/home/order/:order_id',async(req,res)=>{
  let id = req.params.order_id;
  var order_items = await db.getOrderDetails(id);
  var order = await db.getOrder(id);
  var order_trans = await db.getOrderTrans(id);
  console.log(order_items);
  console.log(order);
  console.log(order_trans);
  res.render('staff/orderDetails',{
    order_items : order_items,
    order : order[0],
    order_trans : order_trans[0]
  })
  // res.redirect('/admin/home');
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