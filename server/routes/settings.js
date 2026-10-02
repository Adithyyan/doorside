const express = require('express');
const router = express.Router();
const settings = require('../controllers/settings.js');

router.get('/', settings.getPublicSettings);
router.get('/public', settings.getPublicSettings);
router.get('/homepage', settings.getHomepageSections);
router.get('/pages/:slug', settings.getPageBySlug);

module.exports = router;
