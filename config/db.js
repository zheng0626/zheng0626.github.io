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

class DbService{
    static getDbServiceInstance(){
        return instance ? instance : new DbService();
    }

    async getCatFoodData(){
        const response = await new Promise((resolve, reject )=>{
            const query = "SELECT * FROM category;";
            pool.execute(query, (err,results)=>{
                if (err) throw err;
                resolve(results);
            });
        });

        

        console.log(response)
        return response;
    }
}

let database = new DbService();
database.getCatFoodData();



// module.exports = pool.promise();
module.exports = DbService;