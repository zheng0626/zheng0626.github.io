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
        pool.query('SELECT * FROM user WHERE id = ?',[id],(error,user)=>{
            if(error){
                return reject(error);
            }
            return resolve(user);
        })
    })
}

db.getUserUsername= (username) =>{
    return new Promise((resolve,reject)=>{
        pool.query('SELECT * FROM user WHERE username = ?',[username],(error,user)=>{
            if(error){
                return reject(error);
            }
            return resolve(user[0])
        })
    })
}

db.insertUser = (username, password) =>{
    return new Promise((resolve,reject)=>{
        pool.query('INSERT INTO user (username, password) VALUES (?, ?)',[username,password],(err, result)=>{
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
        pool.query(`SELECT p.name,p.briefName,p.prepTime,p.id,p.category_id,price,c.name AS categoryName 
                    FROM products p 
                    JOIN category c 
                    on p.category_id = c.id;` ,(err,result)=>{
            if(err){
                return reject(err);
            }
            return resolve(result);
        })
    })
}

db.getIDFood = (food_id) =>{
  return new Promise((resolve,reject)=>{
    pool.query(`SELECT name,briefName,products.id,products.prepTime,price,category_id,type FROM products WHERE id = ${food_id};`,(err,result)=>{
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

db.addProduct = (product_id,product_name,briefName,categoryId,price,prep_time,des) =>{
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
        available,
        prepTime,
        briefName
    )
    VALUES(default,'${product_id}','${product_name}',${price},${categoryId},'${des}',default,default,'${briefName}');`,(err,result)=>{
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

db.modifyProduct = (id,name,briefName,cat,price,prepTime,desc) =>{
  prepTime = prepTime || null;
  desc = desc || null;
  return new Promise((resolve,reject)=>{
    pool.query(`UPDATE products SET name = "${name}", briefName="${briefName}", category_id = ${cat}, price = ${price}, comment = ${desc}, prepTime = ${prepTime} WHERE id = ${id};`,(err,result)=>{
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

db.transactionWTime = (order_id,status,timestamp,collectionTime) =>{
  return new Promise((resolve,reject)=>{
    pool.query(`INSERT INTO transaction(
        id,
        collectionNum,
        paymentStatus,
        createdAt,
        updatedAt,
        collectionTime
    )
    VALUES(${order_id},default,"${status}","${timestamp}",default,'${collectionTime}');`,(err,result)=>{
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
        updatedAt,
        collectionTime
    )
    VALUES(${order_id},default,"${status}","${timestamp}",default,default);`,(err,result)=>{
      if(err){
        return reject(err);
      }
      return resolve(result);
    })
  })
}

db.getWaitingOrder = () =>{
  return new Promise((resolve,reject)=>{
    pool.query(`SELECT * FROM food_ordering_system_db.order JOIN transaction on food_ordering_system_db.order.id = transaction.id 
      WHERE food_ordering_system_db.order.status != "2" 
      AND transaction.collectStatus = "0" 
      AND date(transaction.createdAt) = CURRENT_DATE()
      LIMIT 20;`,(err,result)=>{
      if(err){
        return reject(err);
      }
      return resolve(result);
    } )
  })
}

db.getProcessingOrder = () =>{
  return new Promise((resolve,reject)=>{
    pool.query(`SELECT * FROM food_ordering_system_db.order JOIN transaction on food_ordering_system_db.order.id = transaction.id 
      WHERE food_ordering_system_db.order.status = "0" 
      AND date(transaction.createdAt) = CURRENT_DATE()
      LIMIT 20;`,(err,result)=>{
      if(err){
        return reject(err);
      }
      return resolve(result);
    } )
  })
}

db.getTwentyOrderHistory = () =>{
  return new Promise((resolve,reject)=>{
    pool.query(`SELECT * FROM food_ordering_system_db.order
      JOIN transaction on food_ordering_system_db.order.id = transaction.id
      WHERE food_ordering_system_db.transaction.collectStatus = "1"
      or food_ordering_system_db.order.status = "2" 
      ORDER BY transaction.collectionNum DESC
      LIMIT 20;`,(err,result)=>{
      if(err){
        return reject(err);
      }
      return resolve(result);
    } )
  })
}

db.getOrderDetails = (order_id) =>{
  return new Promise((resolve,reject)=>{
    pool.query(`SELECT p.name,p.briefName,oi.quantity FROM food_ordering_system_db.order o
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

db.getTotalEarn = () =>{
  return new Promise((resolve,reject)=>{
    pool.query(`SELECT SUM(total) FROM food_ordering_system_db.order WHERE status != 2;`,(err,result)=>{
      if(err){
        return reject(err);
      }
      return resolve(result);
    })
  })
}

db.getAllOrder = () =>{
  return new Promise((resolve,reject)=>{
    pool.query(`SELECT * FROM food_ordering_system_db.order;`,(err,result)=>{
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
    pool.query(`SELECT t.collectionTime,t.collectionNum,t.paymentStatus,t.createdAt,t.updatedAt FROM transaction t WHERE t.id = ${order_id};`,(err,result)=>{
      if(err){
        return reject(err);
      }
      return resolve(result);
    })
  })
}

db.getAllDoneOrder = () =>{
  return new Promise((resolve,reject)=>{
    pool.query(`SELECT t.collectionNum,t.collectionTime,oi.productId,p.briefName,oi.quantity FROM food_ordering_system_db.order o inner join transaction t
    on o.id = t.id
    inner join order_items oi
    on o.id = oi.orderId
    inner join products p
    on p.id = oi.productId
    WHERE status = 1;`,(err,result)=>{
      if(err){
        return reject(err);
      }
      return resolve(result);
    })
  })
}

db.getAllNeedPrepareOrder = () =>{
  return new Promise((resolve,reject)=>{
    pool.query(`SELECT o.id,t.collectionNum,t.collectionTime,t.createdAt,oi.productId,p.briefName,oi.quantity 
    FROM food_ordering_system_db.order o inner join transaction t
    on o.id = t.id
    inner join order_items oi
    on o.id = oi.orderId
    inner join products p
    on p.id = oi.productId
    WHERE status = 0
    AND date(t.createdAt) = CURRENT_DATE();`,(err,result)=>{
      if(err){
        return reject(err);
      }
      return resolve(result);
    })
  })
}

db.getAllCollectionNum = () =>{
  return new Promise((resolve,reject)=>{
    pool.query(`SELECT t.id,t.createdAt,t.collectionNum,t.collectionTime FROM food_ordering_system_db.order o inner join transaction t
    on o.id = t.id
    WHERE status = 0
    AND date(t.createdAt) = CURRENT_DATE()
    ORDER BY collectionTime asc;`,(err,result)=>{
      if(err){
        return reject(err);
      }
      return resolve(result);
    })
  })
}

db.updateOrderStatus = (id,action,timestamp) =>{
  return new Promise((resolve,reject)=>{
    pool.query(`UPDATE food_ordering_system_db.order SET status = ${action}, updatedTime = '${timestamp}' WHERE id=${id};`,(err,result)=>{
      if(err){
        return reject(err);
      }
      return resolve(result);
    })
  })
}

db.updateTransCollectStatus = (id,action,timestamp) =>{
  console.log(action);
  console.log(id);
  return new Promise((resolve,reject)=>{
    pool.query(`UPDATE transaction SET collectStatus = ${action}, updatedAt = '${timestamp}' WHERE id=${id};`,(err,result)=>{
      if(err){
        return reject(err);
      }
      return resolve(result);
    })
  })
}

db.updateTransPaymentStatus = (id,action) =>{
  return new Promise((resolve,reject)=>{
    pool.query(`UPDATE transaction SET paymentStatus = ${action} WHERE id=${id};`,(err,result)=>{
      if(err){
        return reject(err);
      }
      return resolve(result);
    })
  })
}

db.getAllUser = () =>{
  return new Promise((resolve,reject)=>{
    pool.query(`SELECT * FROM food_ordering_system_db.user;`,(err,result)=>{
      if(err){
        return reject(err);
      }
      return resolve(result);
    })
  })
}

db.addUser = (name,username,pass,isStaff) =>{
  return new Promise((resolve,reject)=>{
    pool.query(`INSERT INTO food_ordering_system_db.user(
      name,
      username,
      password,
      isStaff
    )
      VALUES('${name}','${username}','${pass}',${isStaff})`,(err,result)=>{
      if(err){
        return reject(err);
      }
      return resolve(result);
    })
  })
}

db.updateLoginUserTime = (id,timestamp) =>{
  return new Promise((resolve,reject)=>{
    pool.query(`UPDATE food_ordering_system_db.user a SET lastLogin = '${timestamp}' WHERE a.id=${id};`,(err,result)=>{
      if(err){
        return reject(err);
      }
      return resolve(result);
    })
  })
}

db.getUserById = (id) =>{
  return new Promise((resolve,reject)=>{
    pool.query(`SELECT * FROM food_ordering_system_db.user a WHERE a.id=${id};`,(err,result)=>{
      if(err){
        return reject(err);
      }
      return resolve(result);
    })
  })
}

db.updateUserById = (id,name,username) =>{
  return new Promise((resolve,reject)=>{
    pool.query(`UPDATE food_ordering_system_db.user a SET name = '${name}',username = '${username}' WHERE a.id=${id};`,(err,result)=>{
      if(err){
        return reject(err);
      }
      return resolve(result);
    })
  })
}

db.deleteUserById = (id) =>{
  return new Promise((resolve,reject)=>{
    pool.query(`DELETE FROM food_ordering_system_db.user a WHERE a.id=${id};`,(err,result)=>{
      if(err){
        return reject(err);
      }
      return resolve(result);
    })
  })
}

db.getTheNext40MinOrder = () =>{
  return new Promise((resolve,reject)=>{
    pool.query(`SELECT id,createdAt,collectionTime,collectStatus FROM food_ordering_system_db.transaction 
                WHERE date(createdAt) = current_date()
                AND collectStatus = 0 
                AND Time(collectionTime) >= TIME_FORMAT(CURRENT_time()+interval 15 minute, "%H:%i:%s")
                AND Time(collectionTime) < TIME_FORMAT(CURRENT_time()+interval 60 minute, "%H:%i:%s");`,(err,result)=>{
      if(err){
        return reject(err);
      }
      return resolve(result);
    })
  })
}

db.getOrderItemType = (id) =>{
  return new Promise((resolve,reject)=>{
    pool.query(`SELECT p.type FROM food_ordering_system_db.order_items o 
      inner Join products p on o.productId = p.id 
      where orderId = ${id};`,(err,result)=>{
      if(err){
        return reject(err);
      }
      return resolve(result);
    })
  })
}


// module.exports = pool.promise();
module.exports = db;