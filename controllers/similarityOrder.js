const db = require('../config/db');

const getPreparationTimeNeeded = (orderCart) =>{
  console.log(orderCart.generateArray());
}

const findSimilarity = (first,second) =>{
  const firstLength = (first.Category).length;
  const secondLength = (second.Category).length;
  const smaller = firstLength < secondLength ? first : second;
  console.log(smaller)
  const greater = smaller === first ? second : first;

  var acc= 0;
  (smaller.Category).forEach(element => {
    console.log(element);
    if(greater.Category.includes(element)){
      acc++;
    }
  });

  console.log(acc/Math.min(firstLength,secondLength) * 100);
}


module.exports =getPreparationTimeNeeded;