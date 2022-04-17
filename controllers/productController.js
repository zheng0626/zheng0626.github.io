// Controller for all the product and category management
const db = require('../config/db');

let productController = {};


// Display all instance of Categories and Products for Product Management page
productController.all_instance_get = async (req,res) =>{
  let allFood = await db.getAllFood();
  let allCategory = await db.getAllCategory();
  res.render('staff/manage_product',{
    products: allFood,
    categories: allCategory
  });
}


// Display Product instance with deafult value
productController.modifyProduct_get = async (req,res)=>{
  let product_id = req.params.product_id;
  let p = await db.getIDFood(product_id);
  let allCategory = await db.getAllCategory();
  res.render('staff/modifyProduct',{
    product : p,
    categories: allCategory
  });
}

// Display Category instance with deafult value
productController.modifyCategory_get = async(req,res)=>{
  let category_id = req.params.category_id; 
  let c = await db.getIdCat(category_id);
  res.render('staff/addCategory',{
    category: c
  })
}

// Display Empty form to Add product and Category Selection
productController.addProduct_get = async(req,res)=>{
  let allCategory = await db.getAllCategory();
  res.render('staff/modifyProduct',{
    categories : allCategory
  });  
}

// Display Empty form to Add Category
productController.addCategory_get = (req,res)=>{
  res.render('staff/addCategory');
}

// POST add category
productController.addCategory_post = async(req,res)=>{
  let catName = req.body.category_name;

  await db.addCategory(catName,null);
  res.redirect('/user/manage-product');
}


// POST add product
productController.addProduct_post = async(req,res)=>{
  let product_id = null;
  let name = req.body.title_field;
  let briefName = req.body.briefName_field;
  let categoryId = req.body.category_field;
  let price = req.body.price_field;
  let prep_time = req.body.prepTime_field || null;
  let desc = req.body.desc_field || null;

  await db.addProduct(product_id,name,briefName,categoryId,price,prep_time,desc);
  res.redirect('/user/manage-product');
}

// POST delete or modify product instance
productController.modifyProduct_post =  async(req,res)=>{
  if(req.body.action == 'OK'){
    let id = req.params.product_id;
    let name = req.body.title_field;
    let briefName = req.body.briefName_field;
    let categoryId = req.body.category_field;
    let price = req.body.price_field;
    let prep_time = req.body.prepTime_field || null;
    let desc = req.body.desc_field || null;
  
  
    await db.modifyProduct(id,name,briefName,categoryId,price,prep_time,desc);
  
    res.redirect('/user/manage-product');
  }
  else if(req.body.action == "delete"){
    let id = req.params.product_id;
    await db.deleteProduct(id);
    res.redirect('/user/manage-product');
  }
  else{
    console.log("ERROR");
  }
}

// POST modify or delete category instance
productController.modifyCategory_post = async (req,res)=>{
  if(req.body.action == 'OK'){
    let id = req.params.cat_id;
    let name = req.body.category_name;
    await db.modifyCategory(id,name);
    res.redirect('/user/manage-product');
  }
  else if(req.body.action == 'delete'){
    let id = req.params.cat_id;
    await db.deleteCategory(id);
    res.redirect('/user/manage-product');
  }
  else{
    console.log("ERROR")
  }
}

module.exports = productController;