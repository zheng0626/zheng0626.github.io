// Controller for kitchen display page
const db = require('../config/db');
let kitchenDisplayController = {};

kitchenDisplayController.kitchenDisplayPage_get = async (req,res)=>{
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
}

module.exports = kitchenDisplayController;