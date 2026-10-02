const express = require('express');
const router = express.Router();
const reviews = require('../controllers/reviews.js');
const helpers = require('../helpers.js');

router.get('/', reviews.getReviews);
router.post('/', helpers.optionalLogin, reviews.submitReview);

module.exports = router;
