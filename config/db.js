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
        pool.query(`SELECT p.name,p.id,p.category_id,price,c.name AS categoryName FROM products p JOIN category c on p.category_id = c.id;` ,(err,result)=>{
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

db.getIdCat = (cat_id) =>{
  return new Promise((resolve,reject)=>{
    pool.query(`SELECT id,name FROM category WHERE id = ${cat_id};`,(err,result)=>{
      if(err){
        return reject(err);
      }
      return resolve(result);
    } )
  })
}

db.getIDProdcutNaddToCart = (food_id,cart) =>{
  return new Promise((resolve,reject)=>{
    pool.query(`SELECT name,products.id,price,category_id FROM products WHERE id = ${food_id};`,(err,result)=>{
      if(err){
        return reject(err);
      }
      cart.add(result[0]);
      return resolve(cart);
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
    VALUES(default,'${product_id}','${product_name}',${price},${categoryId},'${des}',default);`,(err,result)=>{
      if(err){
        return reject(err);
      }
      return resolve(result);
    })
  })
}

db.deleteProduct = (product_id) =>{
  return new Promise((resolve,reject)=>{
    pool.query(`DELETE FROM products WHERE id = ${product_id};`,(err,result)=>{
      if(err){
        return reject(err);
      }
      return resolve(result);
    } )
  })
}

db.deleteCategory = (cat_id) =>{
  return new Promise((resolve,reject)=>{
    pool.query(`DELETE FROM category WHERE id = ${cat_id};`,(err,result)=>{
      if(err){
        return reject(err);
      }
      return resolve(result);
    } )
  })
}

db.addCategory = (category_name,category_status) =>{
  category_status = category_status || null;
  return new Promise((resolve,reject)=>{
    pool.query(`INSERT into category(
        id,
        name,
        status
    )
    VALUES(default,'${category_name}',default);`,(err,result)=>{
      if(err){
        return reject(err);
      }
      return resolve(result);
    })
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

db.modifyCategory = (id,name) =>{
  return new Promise((resolve,reject)=>{
    pool.query(`UPDATE category SET name = "${name}" WHERE id = ${id};`,(err,result)=>{
      if(err){
        return reject(err);
      }
      return resolve(result);
    })

  })
}

db.checkOut = (cart) =>{
  return new Promise((resolve,reject)=>{
    pool.query(`INSERT INTO food_ordering_system_db.order(
        id,
        createdTime,
        updatedTime,
        phoneNum,
        total,
        status
    )
    VALUES(default,default,default,default,${cart.totalPrice},default)`,(err,result)=>{
      if(err){
        return reject(err);
      }
      return resolve(result);
    })
  })
}

db.setOrderDetails= (order_id,product_id,quantity,price) =>{
  return new Promise((resolve,reject)=>{
    pool.query(`INSERT INTO food_ordering_system_db.order_items(
        id,
        orderId,
        productId,
        quantity,
        price
    )
    VALUES(default,"${order_id}","${product_id}","${quantity}","${price}")`,(err,result)=>{
      if(err){
        return reject(err);
      }
      return resolve(result);
    })
  })
}

db.transaction = (order_id,status,timestamp) =>{
  return new Promise((resolve,reject)=>{
    pool.query(`INSERT INTO transaction(
        id,
        collectionNum,
        paymentStatus,
        createdAt,
        updatedAt
    )
    VALUES(${order_id},default,"${status}","${timestamp}",default);`,(err,result)=>{
      if(err){
        return reject(err);
      }
      return resolve(result);
    })
  })
}

db.getWaitingOrder = () =>{
  return new Promise((resolve,reject)=>{
    pool.query(`SELECT * FROM food_ordering_system_db.order JOIN transaction on food_ordering_system_db.order.id = transaction.id WHERE food_ordering_system_db.order.status != "2" LIMIT 10;`,(err,result)=>{
      if(err){
        return reject(err);
      }
      return resolve(result);
    } )
  })
}

db.getTenOrderHistory = () =>{
  return new Promise((resolve,reject)=>{
    pool.query(`SELECT * FROM food_ordering_system_db.order JOIN transaction on food_ordering_system_db.order.id = transaction.id WHERE food_ordering_system_db.order.status = "2" LIMIT 10;`,(err,result)=>{
      if(err){
        return reject(err);
      }
      return resolve(result);
    } )
  })
}

db.getOrderDetails = (order_id) =>{
  return new Promise((resolve,reject)=>{
    pool.query(`SELECT p.name,oi.quantity FROM food_ordering_system_db.order o
    JOIN order_items oi 
    ON o.id = oi.orderId
    INNER JOIN products p
    ON oi.productId = p.id
    WHERE o.id=${order_id};`,(err,result)=>{
      if(err){
        return reject(err);
      }
      return resolve(result);
    })
  })
}

db.getOrder = (order_id) =>{
  return new Promise((resolve,reject)=>{
    pool.query(`SELECT o.total FROM food_ordering_system_db.order o WHERE o.id=${order_id};`,(err,result)=>{
      if(err){
        return reject(err);
      }
      return resolve(result);
    })
  })
}


db.getOrderTrans = (order_id) =>{
  return new Promise((resolve,reject)=>{
    pool.query(`SELECT t.collectionNum,t.paymentStatus,t.createdAt,t.updatedAt FROM transaction t WHERE t.id = ${order_id};`,(err,result)=>{
      if(err){
        return reject(err);
      }
      return resolve(result);
    })
  })
}

// module.exports = pool.promise();
module.exports = db;