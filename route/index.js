const express = require('express');
const router = express.Router();
const db = require('../config/db');
const indexController = require('../controllers/indexController');

router.get('/',indexController.homepage_get);

router.get('/combinationPlatter',indexController.combinationPlatter_get);

router.get('/setMealCategory',indexController.setMealPlatter_get);

router.get('/setMealCategory/royalBanquet',indexController.royalBanquet_get);


module.exports = router;
