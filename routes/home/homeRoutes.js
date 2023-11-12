const router = require('express').Router();
const homeController = require('../../controllers/home/homeController');


router.get('/get-categories', homeController.get_categories)


module.exports = router