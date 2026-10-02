const express = require('express');
const router = express.Router();
const media = require('../controllers/media.js');

router.get('/', media.getMedia);

module.exports = router;
