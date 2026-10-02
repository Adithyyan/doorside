const express = require('express');
const router = express.Router();
const payments = require('../controllers/payments.js');
const helpers = require('../helpers.js');

router.post('/verify', payments.verifyPayment);

module.exports = router;
