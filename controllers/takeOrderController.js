// Controller for taking order page
const db = require('../config/db');
const Cart = require('../models/orderCart');
let orderTakingController = {};

// GET display take order page
orderTakingController.takeOder_get = async(req,res)=>{
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
}

// GET add the product to the session cart
orderTakingController.addToCart_get = async (req,res) =>{
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
}

// GET cancel and delete the session cart instance
orderTakingController.cancelOrder_get = (req,res)=>{
  var cart = new Cart(req.session.cart ? req.session.cart : {});
  cart.cancel();
  req.session.cart = cart;
  req.session.save(()=>{
    res.redirect('/user/takeOrder');
  })
}

//POST set collection time for the session cart
orderTakingController.setCollectionTime_post = (req,res)=>{
  var cart = new Cart(req.session.cart ? req.session.cart : {});
  var time = req.body.collectionTime;

  console.log(time);
  res.json({msg:'success'});
  cart.setTime(time);
  req.session.cart = cart;
  req.session.save(()=>{
    res.redirect('/user/takeOrder');
  })
}

//GET checkout the session cart
orderTakingController.checkout_get = async (req,res)=>{
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
}

// GET produce recommend time for collection
orderTakingController.getRecommendTime_get = async(req,res)=>{
  var cart = new Cart(req.session.cart ? req.session.cart : {});
  console.log(recommendTime(cart));
  res.json({msg:'sohai'});
}

module.exports = orderTakingController;