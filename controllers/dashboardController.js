// Controller for dashboard page
const db = require('../config/db');
let dashboardController = {};

dashboardController.homepage_get = async(req,res) =>{
  let waiting_orders = await db.getWaitingOrder();
  let twenty_order_history = await db.getTwentyOrderHistory();
  let numProcessingOrders = Object.keys(waiting_orders).length;
  res.render('staff/admin_dashboard',{
    WO : waiting_orders,
    TOH : twenty_order_history,
    NPO:numProcessingOrders
  });
}

dashboardController.getSpecificOrder_get = async(req,res)=>{
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
}

dashboardController.updatePaymentStatus_post = async(req,res)=>{
  var id = req.params.order_id;
  var action = req.params.action;
  await db.updateTransPaymentStatus(id,action).then(()=>{
    res.json({msg:'success'});
  },()=>{
    res.json({msg:'fail'});
  });
}

dashboardController.updateCollectStatus_post = async(req,res)=>{
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
}

module.exports = dashboardController;