require('dotenv').config();
const { response } = require('express');
const mysql = require('mysql2');
let instance = null;


const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD
})


// const connection = mysql.createConnection({
//     host: process.env.DB_HOST,
//     user : process.env.DB_USER,
//     database: process.env.DB_NAME,
//     password: process.env.DB_PASSWORD,
//     port: process.env.PORT
// });

// let sql = "SELECT * FROM category;";

// var categories_dict = {};
// pool.execute(sql, function(err,result){
//     if (err) throw err;
//     // categories.forEach(cat => {

//     //     categories_dict[cat.categoryName] = [];


//     //     let sql2 = `SELECT name,price FROM foods WHERE category_id = ${cat.id}`
//     //     pool.execute(sql2, (err2,foods) =>{
//     //         if (err) throw err;
//     //         categories_dict[cat.categoryName].push(foods);
//     //     })
//     // });
//     return result;
// });

// connection.connect((err)=>{
//     if(err){
//         console.log(err.message);
//     };
//     console.log('db ' + connection.state);
// })

// pool.execute(sql,(err,result)=>{
//     if(err) throw err;
//     return result;
// })

// class DbService{
//     static getDbServiceInstance(){
//         return instance ? instance : new DbService();
//     }

//     // getAllCatFood(){
//     //     let categories_dict = {};
//     //     const query = `SELECT * FROM category;`;
//     //     let cat_data = pool.execute(query, (err,categories)=>{
//     //         if (err) throw err;
//     //         console.log
//     //         return categories;
//     //     });
//     //     let food_data = pool.execute(`SELECT * FROM foods;`,(err,foods)=>{
//     //         if (err) throw err;
//     //         return foods;
//     //     })
//     //     console.log(cat_data);
//     //     return cat_data;
//     // }

//     async getAllCatFood(){
//         let categories_dict = {};
//         let cat_res = await new Promise((resolve, reject )=>{
//             const query = `SELECT * FROM category;`;
//             pool.execute(query, (err,categories)=>{
//                 if (err) throw err;

//                 resolve(categories);
//             });
//         });
//         let food_res = await new Promise((resolve,reject)=>{
//             pool.execute(`SELECT * FROM foods;`,(err,foods)=>{
//                 if (err) throw err;

//                 resolve(foods);
//             })
//         })

//         cat_res.forEach(cat => {
//             categories_dict[cat.categoryName] = [];
//             food_res.forEach(food => {
//                 if (food.category_id == cat.id){
//                     categories_dict[cat.categoryName].push(food);
//                 }
//             });
//         });
//         console.log(categories_dict);
//         return categories_dict;
//     }

//     async getFoodById(catId){
//         const response = await new Promise((resolve,reject)=>{
//             const query = `SELECT * FROM foods WHERE category_id = ${catId};`;
//             pool.execute(query, (err,results)=>{
//                 if (err) throw err;
//                 resolve(results);
//             });
//         })
//         return response;
//     }


// }


module.exports = pool.promise();
// module.exports = DbService;