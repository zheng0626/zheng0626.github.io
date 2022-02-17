const express = require('express');
const res = require('express/lib/response');
const app = express();
const path = require('path');
const cors= require('cors');
const router = express.Router();
// const db = require('./config/db')
const dbService = require('./config/db')

app.set('view engine', 'pug');
app.set('views',path.join(__dirname,'views'));

app.use(express.static(path.join(__dirname,'public')));
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cors());



// router.get('/',(req,res)=>{
//     res.sendFile(path.join(__dirname,"views","index.pug"));
// })

router.get('/',(req,res) =>{
    let fetchDb = new dbService();
    console.log(fetchDb.getCatFoodData());
    // categories.forEach(cat => {
    //     let sql2 = `SELECT name,price FROM foods WHERE category_id = ${cat.id}`
    //     categories_dict[cat.categoryName] = db.execute(sql2);
    // });
    // res.render('index',{
    //     categoryNfood : categories_dict
    // });
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

app.listen(5000,()=>{
    console.log('server is listening on port 5000...');
})