const express = require('express');
const router = express.Router();
const Cart = require('../models/orderCart');
const recommendTime = require('../controllers/similarityOrder');
const md5 = require('md5');
const isAuth= require('../middleware/auth').isAuth;
const passport = require('passport');
const takeOderController = require('../controllers/takeOrderController');

const db = require('../config/db');

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

router.get('/logout', (req,res)=>{
  req.logout();
  res.redirect('/');
})

router.get('/logout', (req, res, next) => {
  req.logout();
  res.redirect('/');
});


router.get('/takeOrder',isAuth, takeOderController.takeOder_get);

router.get('/takeOrder/add-to-cart/:id',isAuth, takeOderController.addToCart_get);

router.get('/takeOrder/cancelOrder',isAuth,takeOderController.cancelOrder_get);

router.post('/takeOrder/setCollectionTime',isAuth,takeOderController.setCollectionTime_post);

router.get('/takeOrder/checkout',isAuth,takeOderController.checkout_get);

router.get('/takeOrder/getRecommendTime',isAuth,takeOderController.getRecommendTime_get);

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