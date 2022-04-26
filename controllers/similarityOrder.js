const db = require('../config/db');

getPreparationTimeNeeded = {};

getPreparationTimeNeeded.recommendTime = async (orderCart) =>{
  currentOrderType =[...new Set(orderCart.getAllType())];
  var next40oder = {}
  var next40Trans = await db.getTheNext40MinOrder();
  for(const order of next40Trans){
    orderItems = []
    orderDetails = await getOrderType(order.id);
    orderDetails.forEach(orderType => {
      if(orderType.type != null){
        orderItems.push(orderType.type)
      }
    });
    next40oder[order.collectionTime] = [... new Set(orderItems)];
  }
  console.log(next40Trans,"HELLO");
  return new Promise(resolve =>{
    var similarity = 0;
    var bestTime = 0;
    for(const prop in next40oder){
      resultSimilarity = findSimilarity(next40oder[prop],currentOrderType);
      if(resultSimilarity > similarity){
        similarity = resultSimilarity;
        bestTime = prop;
      }
    }
    resolve(bestTime);
  })

}

const getOrderType = async (id) =>{
  let orderType = await db.getOrderItemType(id);
  return orderType;
}

const findSimilarity = (first,second) =>{
  const firstLength = (first).length;
  const secondLength = (second).length;
  const smaller = firstLength < secondLength ? first : second;
  console.log(smaller)
  const greater = smaller === first ? second : first;

  var acc= 0;
  (smaller).forEach(element => {
    console.log(element);
    if(greater.includes(element)){
      acc++;
    }
  });

  console.log("SIMILARITY VALUE",acc/greater.length * 100);

  return acc/Math.min(firstLength,secondLength) * 100;
}


module.exports =getPreparationTimeNeeded;