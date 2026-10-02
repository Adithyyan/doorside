const express = require('express');
const router = express.Router();
const categories = require('../controllers/categories.js');
const helpers = require('../helpers.js');

router.get('/', categories.getCategoryTree);
router.get('/featured', categories.getFeatured);
router.get('/:slug', categories.getCategoryBySlug);
router.get('/:slug/products', categories.getCategoryProducts);

module.exports = router;
