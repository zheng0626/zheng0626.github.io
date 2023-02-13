// Controller for dashboard page
const db = require('../config/db');
let dashboardController = {};

dashboardController.homepage_get = async(req,res) =>{
  let processingOrder = await db.getWaitingOrder();
  let numProcessOrder = Object.keys(processingOrder).length;
  let waiting_orders = await db.getProcessingOrder();
  let twenty_order_history = await db.getTwentyOrderHistory();
  let numProcessingOrders = Object.keys(waiting_orders).length;
  let numberEarn = await db.getTotalEarn();
  let totalSale = await db.getAllOrder();
  totalSale = Object.keys(totalSale).length;
  numberEarn = numberEarn[0]
  res.render('staff/admin_dashboard',{
    WO : processingOrder,
    TOH : twenty_order_history,
    NPO:numProcessingOrders,
    TE: totalSale,
    NS: numberEarn['SUM(total)'],
    PO: numProcessOrder
  });
}

dashboardController.getSpecificOrder_get = async(req,res)=>{
  let id = req.params.order_id;
  var order_items = await db.getOrderDetails(id);
  var order = await db.getOrder(id);
  var order_trans = await db.getOrderTrans(id);

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
  var timestamp = new Date(Date.now() - x).toISOString().slice(0, 19).replace('T', ' ');
  await db.updateOrderStatus(id,action,timestamp).then(()=>{
    db.updateTransCollectStatus(id,action,timestamp).then(()=>{
      res.json({msg:'success'});
    },()=>{
      res.json({msg:'fail'});
    });
  })
}


module.exports = dashboardController;