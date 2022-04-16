const express = require('express');
const router = express.Router();
const authen = require('../controllers/authenticate');
const Cart = require('../models/orderCart');
const md5 = require('md5');
// further improvement for security
// const { hashSync, genSaltSync, compareSync } = require("bcrypt");
const isAuth= require('../middleware/auth').isAuth;
const passport = require('passport');

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
    res.render('staff/staffLogin');
})

router.post('/register',async (req,res)=>{
  let name = req.body.name_field;
  let username = req.body.username_field;
  let password = req.body.password_field;
  password = md5(password);

  await db.addUser(name,username,password,0);
  passport.authenticate('local', { failureRedirect: '/', successRedirect: '/user/home' });
  res.redirect('/');
})

router.post('/signin', passport.authenticate('local', { failureRedirect: '/', successRedirect: '/user/home' }));
// router.post('/signin',async (req,res)=>{
//     try{
//         const username = req.body.username;
//         let password = req.body.password;
//         password = md5(password);
//         user = await db.getUserUsername(username);

//         if(!user){
//           return res.redirect('/');
//         }

//         if(password == user.password){
//             user.password = undefined;
//             req.session.userId = user.id;
//             req.session.userName = user.name;
//             console.log(req.session.userId);
//             console.log(req.session.userName);
//             req.session.save();
//             return res.redirect('/admin/home');
//         }else{
//           return res.redirect('/');
//         }
//     }catch(e){
//         console.log(e);
//     }
// })


router.get('/logout', (req,res)=>{
  req.logout();
  res.redirect('/');
})

router.get('/logout', (req, res, next) => {
  req.logout();
  res.redirect('/');
});


router.get('/takeOrder',isAuth, async(req,res)=>{
  let allFood = await db.getAllFood();
  let allCategory = await db.getAllCategory();
  var cart = new Cart(req.session.cart ? req.session.cart : {});
  res.render('staff/orderTaking',{
    products_in_order: cart.generateArray(),
    total_price: cart.getTotalPrice(),
    collectionTime:cart.getCollectionTime(),
    products : allFood,
    categories : allCategory
  });
})


router.get('/takeOrder/add-to-cart/:id',isAuth, async (req,res) =>{
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});
  
  // var product = await db.getIDFood(productId);
  // cart.add(product[0]);

  await db.getIDFood(productId).then((product)=>{
    cart.add(product[0]);
    req.session.cart = cart;
    req.session.save(()=>{
      res.redirect('/user/takeOrder');
    })
  });
})

router.get('/takeOrder/cancelOrder',isAuth,(req,res)=>{
  var cart = new Cart(req.session.cart ? req.session.cart : {});
  cart.cancel();
  req.session.cart = cart;
  req.session.save(()=>{
    res.redirect('/user/takeOrder');
  })
})

router.post('/takeOrder/setCollectionTime',isAuth,(req,res)=>{
  var cart = new Cart(req.session.cart ? req.session.cart : {});
  var time = req.body.collectionTime;

  console.log(time);
  res.json({msg:'success'});
  cart.setTime(time);
  req.session.cart = cart;
  req.session.save(()=>{
    res.redirect('/user/takeOrder');
  })
})

router.get('/takeOrder/checkout',isAuth,async (req,res)=>{
  var cart = req.session.cart;
  var payNow = true;
  if(cart.products == undefined){
    console.log("EMPTY CART");
    console.log("Failed order");
    res.redirect('/user/takeOrder');
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
    if(cart.collectionTime =="WalkIn"){
      await db.transaction(order_id,0,timestamp);
    }else{
      await db.transactionWTime(order_id,0,timestamp,cart.collectionTime);
    }

    req.session.cart = {};
    req.session.save(()=>{
      console.log("SUCCESS ORDER");
      res.redirect('/user/takeOrder');
    });
  }
})

router.post('/manage-product/addCategory',isAuth, async(req,res)=>{
  let catName = req.body.category_name;

  await db.addCategory(catName,null);
  res.redirect('/user/manage-product');
  // let allFood = await db.getAllFood();
  // let allCategory = await db.getAllCategory();
  // res.render('staff/manage_product',{
  //   products: allFood,
  //   categories: allCategory
  // });
})

router.get('/orders',isAuth, async (req,res)=>{
  let needPrepareOrderDB = await db.getAllNeedPrepareOrder();
  let waiting_orders = await db.getWaitingOrder();
  let getAllCollectionNum = await db.getAllCollectionNum();
  let allOrderDict = [];
  for(let i = 0;i<Object.keys(getAllCollectionNum).length;i++){
    var order_dict = {
      collectionNum:getAllCollectionNum[i].collectionNum,
      collectionTime:getAllCollectionNum[i].collectionTime,
      items: []
    };
    for(let j = 0;j<Object.keys(needPrepareOrderDB).length;j++){
      if(needPrepareOrderDB[j].collectionNum == getAllCollectionNum[i].collectionNum){
        var item_dict = {
          name:needPrepareOrderDB[j].briefName,
          quantity:needPrepareOrderDB[j].quantity
        }
        order_dict.items.push(item_dict);
      }
    }
    allOrderDict.push(order_dict);
  }
  console.log(allOrderDict);
  console.log(allOrderDict[0]);
  res.render('staff/kds',{
    allOrder:allOrderDict
  });
})



router.get('/home',isAuth,async(req,res) =>{
    let waiting_orders = await db.getWaitingOrder();
    let twenty_order_history = await db.getTwentyOrderHistory();
    let numProcessingOrders = Object.keys(waiting_orders).length;
    res.render('staff/admin_dashboard',{
      WO : waiting_orders,
      TOH : twenty_order_history,
      NPO:numProcessingOrders
    });
})

router.get('/home/order/:order_id',isAuth,async(req,res)=>{
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

router.post('/home/order/:order_id/:action/updatePaymentStatus',isAuth,async(req,res)=>{
  var id = req.params.order_id;
  var action = req.params.action;
  await db.updateTransPaymentStatus(id,action).then(()=>{
    res.json({msg:'success'});
  },()=>{
    res.json({msg:'fail'});
  });
})

router.post('/home/order/:order_id/:action/updateCollectStatus',isAuth,async(req,res)=>{
  var id = req.params.order_id;
  var action = req.params.action;
  var x = (new Date()).getTimezoneOffset() * 60000; 
  // var timestamp = new Date().toUTCString().slice(0, 19).replace('T', ' ');
  var timestamp = new Date(Date.now() - x).toISOString().slice(0, 19).replace('T', ' ');
  console.log(timestamp);
  await db.updateOrderStatus(id,action,timestamp).then(()=>{
    db.updateTransCollectStatus(id,action,timestamp).then(()=>{
      res.json({msg:'success'});
    },()=>{
      res.json({msg:'fail'});
    });
  })
})

router.get('/manage-staff',isAuth,async(req,res)=>{
  var allUser = await db.getAllUser();
  res.render('staff/manageStaff',{
    users : allUser
  });
})

router.get('/manage-staff/:id',isAuth,async(req,res)=>{
  var id = req.params.id;
  var getUser = await db.getUserById(id);
  res.json({
    user:getUser[0]
  });
})

router.post('/manage-staff/addStaff',isAuth,async(req,res)=>{
  let name = req.body.name_field;
  let username = req.body.username_field;
  let password = req.body.password_field;
  password = md5(password);
  await db.addUser(name,username,password,1);
  res.redirect('/user/manage-staff');
})

// router.post('/manage-staff/url/addStaff',isAuth,async(req,res)=>{
//   let name = req.body.name_field;
//   let username = req.body.username_field;
//   let password = req.body.password_field;
//   let isStaff = 1;
//   password = md5(password);
//   await db.addUser(name,username,password,isStaff);
//   res.redirect('/user/manage-staff');

//   try{
//     const{name,username,password} = req.body;
//     if(!(name && username && password)){
//       res.status(400).send("All Input is required");
//     }

//     const oldUser = await db.getUserUsername(username);

//     if(oldUser){
//       res.status(409).send("User already Exist. Try Again!");
//     }

//     password = md5(password);
//   }catch(e){
//     return e;
//   }
// })

router.post('/manage-staff/modifyStaff/:id',isAuth,async(req,res)=>{
  var id = req.params.id;
  let name = req.body.name_field;
  let username = req.body.username_field;
  await db.updateUserById(id,name,username);
  res.redirect('/user/manage-staff')
})

router.post('/manage-staff/deleteStaff/:id',isAuth,async(req,res)=>{
  var id = req.params.id;
  await db.deleteUserById(id);
  res.json({msg:'success'});
})


module.exports = router;