// Controller for kitchen display page
const db = require('../config/db');
let kitchenDisplayController = {};

const getProductsAndQuatityWithOrderId = async (orderId)=>{
  let orderInfo = await db.getOrderDetails(orderId);
  let orderList = []
  for(let j = 0;j<Object.keys(orderInfo).length;j++){
    var item_dict = {
      name:orderInfo[j].briefName,
      quantity:orderInfo[j].quantity
    }
    orderList.push(item_dict);
  }
  return orderList
}

kitchenDisplayController.kitchenDisplayPage_get = async (req,res)=>{
  let getAllCollectionNum = await db.getAllCollectionNum();
  let allOrderDict = [];
  for(let i = 0;i<Object.keys(getAllCollectionNum).length;i++){
    let temp_item = await getProductsAndQuatityWithOrderId(getAllCollectionNum[i].id);
    var order_dict = {
      collectionNum:getAllCollectionNum[i].collectionNum,
      collectionTime:getAllCollectionNum[i].collectionTime,
      orderId:getAllCollectionNum[i].id,
      items: temp_item
    };
    allOrderDict.push(order_dict);
  }
  res.render('staff/kds',{
    allOrder:allOrderDict
  });
}

kitchenDisplayController.orderStatusDone_post = async (req,res)=>{
  var id = req.params.order_id;
  var action = req.params.action;
  var x = (new Date()).getTimezoneOffset() * 60000; 
  var timestamp = new Date(Date.now() - x).toISOString().slice(0, 19).replace('T', ' ');
  await db.updateOrderStatus(id,action,timestamp).then(()=>{
    res.json({msg:'success'});
  },()=>{
    res.json({msg:'fail'});
  });
}

module.exports = kitchenDisplayController;