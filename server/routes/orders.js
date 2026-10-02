const express = require('express');
const router = express.Router();
const orders = require('../controllers/orders.js');
const helpers = require('../helpers.js');

router.post('/', helpers.optionalLogin, orders.placeOrder);
router.get('/', helpers.checkLogin, orders.getMyOrders);
router.get('/:id', helpers.optionalLogin, orders.getOrderById);

module.exports = router;
