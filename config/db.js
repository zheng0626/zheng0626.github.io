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
        pool.query(`SELECT * FROM foods;` ,(err,result)=>{
            if(err){
                return reject(err);
            }
            return resolve(result);
        })
    })
}


// module.exports = pool.promise();
module.exports = db;