const mysql = require('mysql');

const pool = mysql.createPool({
    connectionLimit : 100,
    host : "localhost",
    user : "root",
    password : '',
    database : 'food_ordering_system',
    debug : false

});

function queryRow(){
    pool.query('SELECT * from category',(err, data) => {
        if(err){
            console.log(err)
        }else{
            console.log(data);
        }
    });
}

setTimeout(()=>{
    queryRow();
},5000)


