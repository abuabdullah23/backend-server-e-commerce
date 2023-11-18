const customerAuthController = require('../../controllers/home/customerAuthController');
const router = require('express').Router();

router.post('/customer-register', customerAuthController.customerRegister )
router.post('/customer-login', customerAuthController.customerLogin )

module.exports = router