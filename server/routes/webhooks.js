const express = require('express');
const router = express.Router();
const payments = require('../controllers/payments.js');

router.post('/razorpay', express.raw({ type: 'application/json' }), payments.handleWebhook);

module.exports = router;
