require('dotenv').config();
const { response } = require('express');
const mysql = require('mysql2');


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
        pool.query(`SELECT name,products.id,products.category_id,price,categoryName FROM products JOIN category on products.category_id = category.id;` ,(err,result)=>{
            if(err){
                return reject(err);
            }
            return resolve(result);
        })
    })
}

db.getIDFood = (food_id) =>{
  return new Promise((resolve,reject)=>{
    pool.query(`SELECT name,products.id,price,category_id FROM products WHERE id = ${food_id};`,(err,result)=>{
      if(err){
        return reject(err);
      }
      return resolve(result);
    } )
  })
}

db.addProduct = (product_id,product_name,categoryId,price,prep_time,des) =>{
  product_id = product_id || null;
  prep_time = prep_time || null;
  des = des || null;
  return new Promise((resolve,reject)=>{
    pool.query(`INSERT into products(
      id,
        product_id,
        name,
        price,
        category_id,
        comment,
        status
    )
    VALUES(default,default,${product_name},${price},${categoryId},${des},NULL);`)
  })
}

db.modifyProduct = (id,name,cat,price,prepTime,desc) =>{
  prepTime = prepTime || null;
  desc = desc || null;
  return new Promise((resolve,reject)=>{
    pool.query(`UPDATE products SET name = "${name}", category_id = ${cat}, price = ${price}, comment = ${desc} WHERE id = ${id};`,(err,result)=>{
      if(err){
        return reject(err);
      }
      return resolve(result);
    })

  })
}


// module.exports = pool.promise();
module.exports = db;