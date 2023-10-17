const router = require('express').Router();
const productController = require('../../controllers/dashboard/productController');
const { authMiddleware } = require('../../middlewares/authMiddleware');

router.post('/add-product', authMiddleware, productController.add_product)
router.get('/get-product', authMiddleware, productController.get_product)

module.exports = router