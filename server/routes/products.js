const express = require('express');
const router = express.Router();
const products = require('../controllers/products.js');
const helpers = require('../helpers.js');

router.get('/', products.getProducts);
router.get('/filters', products.getFiltersAndSortOptions);
router.get('/featured', products.getFeatured);
router.get('/slug/:slug', products.getProductBySlug);
router.get('/:urlHandle', products.getOne);

module.exports = router;
