const express = require('express');
const router = express.Router();
const upload = require('../utils/upload');
const menuController = require('../controllers/menuController');
const shopController = require('../controllers/shopController');

router.get('/:slug', shopController.getShopDetailsBySlug, menuController.getMainCategory, menuController.getSubCategory);
router.get('/:slug/:submenu', menuController.getMenuItem);
router.post('/login', shopController.shopLogin);
router.post('/:slug/create-cate', menuController.createCategory);
router.post('/:slug/:category/create-subCate', menuController.createSubCategory);
router.post('/:slug/:submenu/create-menu',upload.single('image'), menuController.createMenuItem);

router.delete('/:slug/delete-category', menuController.deleteCategory)
router.delete('/:slug/delete-submenu', menuController.deleteSubCategory);
router.delete('/:slug/:submenu/delete-menu', menuController.deleteMenu);

module.exports = router;