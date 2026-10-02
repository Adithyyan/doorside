const express = require('express');
const router = express.Router();
const cart = require('../controllers/cart.js');
const helpers = require('../helpers.js');

router.post('/calculate', helpers.optionalLogin, cart.calculate);
router.post('/validate-coupon', helpers.optionalLogin, cart.validateCoupon);
router.get('/shipping-settings', cart.getShippingSettings);

module.exports = router;
