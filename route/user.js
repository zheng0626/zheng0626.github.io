const express = require('express');
const router = express.Router();
const recommendTime = require('../controllers/similarityOrder');
const md5 = require('md5');
const isAuth= require('../middleware/auth').isAuth;
const passport = require('passport');
const takeOderController = require('../controllers/takeOrderController');
const dashboardController = require('../controllers/dashboardController');
const staffController = require('../controllers/staffController');
const kitchenDisplayController = require('../controllers/kitchenDisplayController');
const authenticateController = require('../controllers/authenticateController');
const db = require('../config/db');
const productController = require('../controllers/productController');
const { addStaff_post } = require('../controllers/staffController');

/* GET users listing. */

// USERS LOGING URL
router.get('/', function (req, res, next) {
    res.render('./index', { error: false });
});

router.get('/signin', authenticateController.singinPage_get);

router.post('/register',authenticateController.register_post);

router.post('/signin', passport.authenticate('local', { failureRedirect: '/', successRedirect: '/user/home' }));

router.get('/logout', (req,res)=>{
  req.logout();
  res.redirect('/');
})

router.get('/logout', (req, res, next) => {
  req.logout();
  res.redirect('/');
});


router.get('/takeOrder',isAuth, takeOderController.takeOder_get);

router.get('/takeOrder/add-to-cart/:id',isAuth, takeOderController.addToCart_get);

router.get('/takeOrder/cancelOrder',isAuth,takeOderController.cancelOrder_get);

router.post('/takeOrder/setCollectionTime',isAuth,takeOderController.setCollectionTime_post);

router.get('/takeOrder/checkout',isAuth,takeOderController.checkout_get);

router.get('/takeOrder/getRecommendTime',isAuth,takeOderController.getRecommendTime_get);

router.post('/manage-product/addCategory',isAuth,productController.addCategory_post);

router.get('/orders',isAuth, kitchenDisplayController.kitchenDisplayPage_get);



router.get('/home',isAuth,dashboardController.homepage_get);

router.get('/home/order/:order_id',isAuth,dashboardController.getSpecificOrder_get);

router.post('/home/order/:order_id/:action/updatePaymentStatus',isAuth, dashboardController.updatePaymentStatus_post);

router.post('/home/order/:order_id/:action/updateCollectStatus',isAuth,dashboardController.updateCollectStatus_post);


router.get('/manage-staff',isAuth,staffController.staffPage_get);

router.get('/manage-staff/:id',isAuth,staffController.viewSpecificStaff_get);

router.post('/manage-staff/addStaff',isAuth,staffController.addStaff_post);

router.post('/manage-staff/modifyStaff/:id',isAuth,staffController.modifyStaff_post);

router.post('/manage-staff/deleteStaff/:id',isAuth,staffController.deleteStaff_post);




module.exports = router;