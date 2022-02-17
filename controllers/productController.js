const res = require('express/lib/response');
const db = require('../config/db');
const Post = require('../models/Post');


// class DbService{
//     static getDbServiceInstance(){
//         return instance ? instance : new DbService();
//     }

//     async getAllCategory(){
//         let categories_dict = {};
//         const query = `SELECT * FROM category;`;
//         const [cat_res, ] = await db.execute(query);
//         const [food_res, ] = await db.execute(`SELECT * FROM foods;`);
//         cat_res.forEach(cat => {
//             categories_dict[cat.categoryName] = [];
//             food_res.forEach(food => {
//                 if (food.category_id == cat.id){
//                     categories_dict[cat.categoryName].push(food);
//                 }
//             });
//         });
//         console.log(cat_res);
//         return cat_res;
//     }

//     async getFoodByCatId(catId){
//         const response = await new Promise((resolve,reject)=>{
//             const query = `SELECT * FROM foods WHERE category_id = ${catId};`;
//             db.execute(query, (err,results)=>{
//                 if (err) throw err;
//                 resolve(results);
//             });
//         })
//         return response;
//     }
// }

// exports.getAllCategory = async(req,res,next) =>{
//     try{
//         let categories_dict = {};
//         const query = `SELECT * FROM category;`;
//         const [cat_res, ] = await db.execute(query);
//         const [food_res, ] = await db.execute(`SELECT * FROM foods;`);
//         cat_res.forEach(cat => {
//             categories_dict[cat.categoryName] = [];
//             food_res.forEach(food => {
//                 if (food.category_id == cat.id){
//                     categories_dict[cat.categoryName].push(food);
//                 }
//             });
//         });
//         //console.log(cat_res);
//         return cat_res;
//     }catch(error){
//         console.log(error);
//     }
// }

exports.getAllCategory = async (req,res,next) =>{
    var data = await db.query("SELECT * FROM category");
    console.log(data[0]);
    return data[0];
};
