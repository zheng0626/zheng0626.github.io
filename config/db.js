require('dotenv').config();
const { response } = require('express');
const mysql = require('mysql2');
let instance = null;


const pool = mysql.createPool({
    connectionLimit: 10,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD
})

let db = {};

db.getUser = (id) =>{
    return new Promise((resolve,reject)=>{
        pool.query('SELECT * FROM admin WHERE id = ?',[id],(error,user)=>{
            if(error){
                return reject(error);
            }
            return resolve(user);
        })
    })
}

db.getUserUsername= (username) =>{
    return new Promise((resolve,reject)=>{
        pool.query('SELECT * FROM admin WHERE username = ?',[username],(error,user)=>{
            if(error){
                return reject(error);
            }
            return resolve(user[0])
        })
    })
}

db.insertUser = (username, password) =>{
    return new Promise((resolve,reject)=>{
        pool.query('INSERT INTO admin (username, password) VALUES (?, ?)',[username,password],(err, result)=>{
            if(err){
                return reject(err);
            }
            return resolve(result.insertId);
        });
    });
}

db.getAllCategory = () =>{
    return new Promise((resolve,reject) =>{
        pool.query(`SELECT * FROM category;`,(err,result)=>{
            if(err){
                return reject(err);
            }
            return resolve(result);
        })
    })
}

db.getAllFood = () =>{
    return new Promise((resolve,reject)=>{
        pool.query(`SELECT name,foods.id,price,categoryName FROM foods JOIN category on foods.category_id = category.id;` ,(err,result)=>{
            if(err){
                return reject(err);
            }
            return resolve(result);
        })
    })
}

db.getIDFood = (food_id) =>{
  console.log(food_id);
  return new Promise((resolve,reject)=>{
    pool.query(`SELECT name,foods.id,price,category_id FROM foods WHERE foods.id = ${food_id};`,(err,result)=>{
      if(err){
        return reject(err);
      }
      return resolve(result);
    } )
  })
}


// module.exports = pool.promise();
module.exports = db;