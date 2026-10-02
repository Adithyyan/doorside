const express = require('express');
const router = express.Router();
const users = require('../controllers/users.js');
const helpers = require('../helpers.js');

router.post('/register', users.register);
router.post('/login', users.login);
router.post('/refresh', users.refresh);
router.post('/logout', helpers.checkLogin, users.logout);
router.post('/forgot-password', users.forgotPassword);

router.get('/me', helpers.checkLogin, users.getProfile);
router.put('/me', helpers.checkLogin, users.updateProfile);

router.get('/addresses', helpers.checkLogin, users.getAddresses);
router.post('/addresses', helpers.checkLogin, users.addAddress);
router.delete('/addresses/:id', helpers.checkLogin, users.deleteAddress);

module.exports = router;
