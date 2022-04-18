module.exports = function OrderCart(initProducts){
  this.products = initProducts.products || {};
  this.totalQty = initProducts.totalQty || 0;
  this.totalPrice = initProducts.totalPrice || '0.00';
  this.collectionTime = initProducts.collectionTime || "WalkIn";
  this.add = (product)=>{
    // return new Promise((resolve,reject) =>{
    //   var storedProduct = this.products[product.id];
    //   if(!storedProduct){
    //     storedProduct = this.products[product.id] = {name: product.name, qty:0, price:0};
    //   }
    //   storedProduct.qty++;
    //   var product_price =  Number(parseFloat(product.price).toFixed(2)) + Number(parseFloat(storedProduct.price).toFixed(2));
    //   storedProduct.price = parseFloat(product_price).toFixed(2);
    //   this.totalQty++;
    //   var total_price = Number(parseFloat(product.price).toFixed(2)) + Number(parseFloat(this.totalPrice).toFixed(2))
    //   this.totalPrice = parseFloat(total_price).toFixed(2);
    //   return resolve();
    // })
    var storedProduct = this.products[product.id];
    if(!storedProduct){
      storedProduct = this.products[product.id] = {name: product.briefName, qty:0, price:0, type:product.type};
    }
    storedProduct.qty++;
    var product_price =  Number(parseFloat(product.price).toFixed(2)) + Number(parseFloat(storedProduct.price).toFixed(2));
    storedProduct.price = parseFloat(product_price).toFixed(2);
    this.totalQty++;
    var total_price = Number(parseFloat(product.price).toFixed(2)) + Number(parseFloat(this.totalPrice).toFixed(2))
    this.totalPrice = parseFloat(total_price).toFixed(2);
  };

  this.remove = (id)=>{

    this.products[id].qty--;
    this.products[id].price -= this.products[id].item.price;
    this.totalQty--;
    this.totalPrice -= this.products[id].item.price;

    if(this.items[id].qty <= 0){
      delete this.items[id];
    }

  }

  this.cancel = function(){
    delete this.products;
    delete this.totalQty;
    delete this.totalPrice;
  }

  this.setTime = (time)=>{
    this.collectionTime = time;
  }

  this.getCollectionTime = ()=>{
    return this.collectionTime;
  }

  this.generateArray = function() {
      var arr = []
      for(var id in this.products){
        arr.push(this.products[id])
      }
      return arr;
  }

  this.getAllType = function(){
    var arr = []
    for(var id in this.products){
      let type = this.products[id].type
      if(type != null){
        arr.push(this.products[id].type);
      }
    }
    return arr;
  }

  this.getTotalPrice = () =>{
    return this.totalPrice;
  }
}