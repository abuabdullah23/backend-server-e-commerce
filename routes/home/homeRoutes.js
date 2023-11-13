const router = require('express').Router();
const homeController = require('../../controllers/home/homeController');


router.get('/get-categories', homeController.get_categories)
router.get('/get-products', homeController.get_products)
router.get('/get-price-range-latest-products', homeController.get_price_range_products)


module.exports = router