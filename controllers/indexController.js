const db = require('../config/db');
let indexController = {};

indexController.homepage_get = async (req,res) =>{
  let categories_dict = {};
  let allCategory = await db.getAllCategory();
  let allProduct = await db.getAllFood();
  allCategory.forEach(cat => {
      categories_dict[cat.categoryName] = [];
      allProduct.forEach(item => {
          if (item.category_id == cat.id){
              categories_dict[cat.categoryName].push(item);
          }
      });
  });
  res.render('index',{
      products: categories_dict
  })
}

indexController.combinationPlatter_get = (req, res)=>{
  res.render('combinationPlatter');
}

indexController.setMealPlatter_get = (req,res)=>{
  res.render('setMealCategory');
}

indexController.royalBanquet_get = (req,res)=>{
  res.render('royalBanquet');
}

module.exports = indexController;