const express = require('express');
const router = express.Router();

const menuController = require('../controllers/menuController');
const shopController = require('../controllers/shopController');

router.get('/:slug', shopController.getShopDetailsBySlug, menuController.getMainCategory, menuController.getSubCategory);
router.get('/:slug/:submenu', menuController.getMenuItem);
router.post('/login', shopController.shopLogin);
router.post('/:slug/create-cate', menuController.createCategory);
router.post('/:slug/:category/create-subCate', menuController.createSubCategory);
router.post('/:slug/:submenu/create-menu', menuController.createMenuItem);

module.exports = router;