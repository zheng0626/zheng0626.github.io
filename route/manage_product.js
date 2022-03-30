const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/manage-product' ,async (req,res) =>{
  let allFood = await db.getAllFood();
  let allCategory = await db.getAllCategory();
  res.render('staff/manage_product',{
    products: allFood,
    categories: allCategory
  });
})


router.get('/manage-product/modify-product/:product_id', async (req,res)=>{
  let product_id = req.params.product_id;
  let p = await db.getIDFood(product_id);
  let allCategory = await db.getAllCategory();
  res.render('staff/modifyProduct',{
    product : p,
    categories: allCategory
  });
})

router.get('/manage-product/modify-category/:category_id',async(req,res)=>{
  let category_id = req.params.category_id; 
  let c = await db.getIdCat(category_id);
  res.render('staff/addCategory',{
    category: c
  })
})

router.get('/manage-product/addfood', async(req,res)=>{
  let allCategory = await db.getAllCategory();
  res.render('staff/modifyProduct',{
    categories : allCategory
  });  
})

router.get('/manage-product/addCategory',(req,res)=>{
  res.render('staff/addCategory');
})

router.post('/manage-product/addCategory', async(req,res)=>{
  let catName = req.body.category_name;

  await db.addCategory(catName,null);
  res.redirect('/admin/manage-product');
  // let allFood = await db.getAllFood();
  // let allCategory = await db.getAllCategory();
  // res.render('staff/manage_product',{
  //   products: allFood,
  //   categories: allCategory
  // });
})

router.post('/manage-product/addProduct',async(req,res)=>{
  let product_id = null;
  let name = req.body.title_field;
  let categoryId = req.body.category_field;
  let price = req.body.price_field;
  let prep_time = req.body.prepTime_field || null;
  let desc = req.body.desc_field || null;

  await db.addProduct(product_id,name,categoryId,price,prep_time,desc);
  res.redirect('/admin/manage-product');
})

router.post('/manage-product/modifyProduct/:product_id', async(req,res)=>{
  if(req.body.action == 'OK'){
    let id = req.params.product_id;
    let name = req.body.title_field;
    let categoryId = req.body.category_field;
    let price = req.body.price_field;
    let prep_time = req.body.prepTime_field || null;
    let desc = req.body.desc_field || null;
  
  
    await db.modifyProduct(id,name,categoryId,price);
  
    res.redirect('/admin/manage-product');
  }
  else if(req.body.action == "delete"){
    let id = req.params.product_id;
    await db.deleteProduct(id);
    res.redirect('/admin/manage-product');
  }
  else{
    console.log("ERROR");
  }
})

router.post('/manage-product/modifyCategory/:cat_id',async (req,res)=>{
  if(req.body.action == 'OK'){
    let id = req.params.cat_id;
    let name = req.body.category_name;
    await db.modifyCategory(id,name);
    res.redirect('/admin/manage-product');
  }
  else if(req.body.action == 'delete'){
    let id = req.params.cat_id;
    await db.deleteCategory(id);
    res.redirect('/admin/manage-product');
  }
  else{
    console.log("ERROR")
  }
})

module.exports = router;