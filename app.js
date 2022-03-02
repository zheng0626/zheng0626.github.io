const express = require('express');
const res = require('express/lib/response');
const app = express();
const path = require('path');
const cors= require('cors');
const mysql = require('mysql2/promise');
const router = express.Router();
const productController = require('./controllers/productController');
const db = require('./config/db');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
var adminRoutes = require('./route/user');
// const bootstrap = require('bootstrap')

app.set('view engine', 'pug');
app.set('views',path.join(__dirname,'views'));

app.use(express.static(path.join(__dirname,'public')));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cors());

const options ={
    connectionLimit: 10,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    createDatabaseTable: true
}

const pool = mysql.createPool(options);

const sessionStore = new MySQLStore(options, pool);

app.use(session({
    key: "hello.session.key",
    name: process.env.SESS_NAME,
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    secret: process.env.SESS_SECRET,
    cookie: {
        maxAge: 100*10000,
        sameSite: true,
        //secure: process.env.NODE_ENV === 'production'
    }
}))


// router.get('/',(req,res)=>{
//     res.sendFile(path.join(__dirname,"views","index.pug"));
// })

router.get('/',async (req,res) =>{
    let categories_dict = {};
    let allCategory = await db.getAllCategory();
    let allProduct = await db.getAllFood();
    allCategory.forEach(cat => {
        categories_dict[cat.categoryName] = [];
        allProduct.forEach(item => {
            console.log(item);
            if (item.category_id == cat.id){
                categories_dict[cat.categoryName].push(item);
            }
        });
    });
    // console.log("!");
    // console.log(req.session);  
    // req.session.cart += 100;
    // console.log(req.session.cart);
    // console.log("!");

    // req.session.destroy();
    res.render('index',{
        products: categories_dict
    })
    // res.render('staffLogin');
});


router.get('/getAll',(req,res)=>{
    response.json({
        success:true
    });
})

router.get('/combinationPlatter',(req, res)=>{
    res.render('combinationPlatter');
})

router.get('/setMealCategory',(req,res)=>{
    res.render('setMealCategory');
})

router.get('/setMealCategory/royalBanquet',(req,res)=>{
    res.render('royalBanquet');
})





router.get('')

app.use('/',router);
app.use('/admin', adminRoutes);

app.listen(5000,()=>{
    console.log('server is listening on port 5000...');
})

module.exports = router; 