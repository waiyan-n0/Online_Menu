const express = require('express');
const router = express.Router();
const shopController = require('../controllers/shopController');

router.post('/shops/register', shopController.createShop);
router.get('/shops', shopController.getAllShops);

module.exports = router;