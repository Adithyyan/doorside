const express = require('express');
const router = express.Router();
const orders = require('../controllers/orders.js');
const helpers = require('../helpers.js');

router.post('/', helpers.optionalLogin, orders.placeOrder);

module.exports = router;
