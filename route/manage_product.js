const express = require('express');
const router = express.Router();
const isAuth= require('../middleware/auth').isAuth;
const productController = require('../controllers/productController');

router.get('/manage-product' ,isAuth,productController.all_instance_get);

router.get('/manage-product/modify-product/:product_id', isAuth,productController.modifyProduct_get);

router.get('/manage-product/modify-category/:category_id',isAuth,productController.modifyCategory_get);

router.get('/manage-product/addfood', isAuth,productController.addProduct_get);

router.get('/manage-product/addCategory',isAuth,productController.addCategory_get);

router.post('/manage-product/addCategory',isAuth, productController.addCategory_post);

router.post('/manage-product/addProduct',isAuth,productController.addProduct_post);

router.post('/manage-product/modifyProduct/:product_id',isAuth, productController.modifyProduct_post);

router.post('/manage-product/modifyCategory/:cat_id',isAuth,productController.modifyCategory_post);

module.exports = router;