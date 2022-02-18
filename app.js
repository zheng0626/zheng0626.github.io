const express = require('express');
const res = require('express/lib/response');
const app = express();
const path = require('path');
const cors= require('cors');
const router = express.Router();
const productController = require('./controllers/productController');
const DbService = require('./config/db');
var adminRoutes = require('./route/user');

app.set('view engine', 'pug');
app.set('views',path.join(__dirname,'views'));

app.use(express.static(path.join(__dirname,'public')));
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cors());



// router.get('/',(req,res)=>{
//     res.sendFile(path.join(__dirname,"views","index.pug"));
// })

router.get('/',async (req,res) =>{
    // let categories_array = []
    // let categories_dict = {};
    // const query = `SELECT * FROM category;`;
    // const query2 = `SELECT name,price,category_id FROM foods;`;
    // let [cat_res, ] = await DbService.execute(query)
    // let [food_res, ] = await DbService.execute(query2)
    // cat_res.forEach(cat => {
    //     categories_dict[cat.categoryName] = [];
    //     food_res.forEach(food => {
    //         if (food.category_id == cat.id){
    //             categories_dict[cat.categoryName].push(food);
    //         }
    //     });
    // });
    // res.render('index',{
    //     products: categories_dict
    // })
    res.render('staffLogin');
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

router.get('/addfood',(req,res)=>{
    res.render('addfood');
})

router.post('/addfood',(req,res) =>{
    console.log(req.body.category_field);
    res.redirect('/addfood');
})




router.get('')

app.use('/',router);
app.use('/admin', adminRoutes);

app.listen(5000,()=>{
    console.log('server is listening on port 5000...');
})

module.exports = router; 