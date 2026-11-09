const shop = require('../models/shopData');
const Category = require('../models/category');
const subCategory = require('../models/subCategory');
const MenuItem = require('../models/menuItem');
const {Msg} = require('../utils/helper');

const createCategory = async (req, res, next) => {
    try{
        const {slug} = req.params;
        const {category}= req.body;
        const shopExist = await shop.findOne({ slug });
        if(!shopExist) {
            return next(new Error('Shop not found!'));
        }
        const cateExist = await Category.findOne({name: category});
        if(cateExist){
           return next(new Error('Category already exists!'));
        }
        const newCategory = await Category.create({
            shopId: shopExist.id,
            name: category
        });
        Msg(res, 'Category created successfully', newCategory);
    }catch(err){
        next(new Error('Failed to create category!'));
    }
}
const getMainCategory = async (req, res, next) => {
    try {
        const categories = await Category.find({ shopId: req.shop._id });
        req.categories = categories;
        next();
    } catch (err) {
        console.log('Error: ', err);
        next(new Error('Error getting categories!'));
    }
};

const createSubCategory = async (req, res, next) => {
    try {
        const { slug, category } = req.params;
        const { name } = req.body;

        const shopExist = await shop.findOne({ slug });
        if (!shopExist) {
            return next(new Error('Shop not found!'));
        }

        const categoryExist = await Category.findOne({
            shopId: shopExist._id,
            name: { $regex: new RegExp(`^${category}$`, 'i') }
        });

        if (!categoryExist) {
            return next(new Error(`Category "${category}" not found under this shop!`));
        }

        const subCategoryExist = await subCategory.findOne({
            categoryId: categoryExist._id,
            name: { $regex: new RegExp(`^${name}$`, 'i') }
        });

        if (subCategoryExist) {
            return next(new Error('Subcategory already exists!'));
        }

        const newSubCategory = await subCategory.create({
            shopId: shopExist._id,
            categoryId: categoryExist._id,
            name: name,
        });

        Msg(res, 'Subcategory created successfully', newSubCategory);
    } catch (err) {
        console.error('Error creating subcategory:', err);
        next(new Error('Error creating sub category'));
    }
}
const getSubCategory = async (req, res, next) => {
    try {
        const categories = req.categories;
        const subCategories = await subCategory.find({ shopId: req.shop.id });

        const fullMenuData = {
            shop: req.shop,
            category: categories,
            subCategory: subCategories
        };

        Msg(res, 'Menu data found successfully.', fullMenuData);
    } catch (err) {
        console.log('Error: ', err);
        next(new Error('Error getting subcategories!'));
    }
};

const createMenuItem = async(req,res, next) =>{
    try{
        const {slug, submenu} = req.params;
        const {name, price,image} = req.body;
        if (!name || price === undefined) {
            return next(new Error('Name and price are required fields!'));
        }
        const shopExist = await shop.findOne({slug});
        if(!shopExist){
            return next(new Error('Shop not found!'));
        }
        const menuExist = await subCategory.findOne({
            shopId: shopExist.id,
            name: { $regex: new RegExp(`^${submenu}$`, 'i') }
        });
        if(!menuExist){
            return next(new Error('Menu not found!'));
        }
        const itemExist = await MenuItem.findOne({name});
        if(itemExist){
            return next(new Error(`${name} already exists!`));
        }
        const newItem = await MenuItem.create({
            shopId: shopExist.id,
            categoryId: menuExist.categoryId,
            subCategoryId: menuExist.id,
            name: name,
            price: price,
            image: image
        });
        Msg(res, 'Menu created Successfully!', newItem);
    }catch(err){
        console.log('err: ',err)
        next(new Error('Error creating menu item!'));
    }
}
const getMenuItem = async (req, res, next) =>{
    try{
        const {slug, submenu} = req.params;
        const shopExist = await shop.findOne({slug});
        if(!shopExist){
            return next(new Error('Shop not found!'));
        }
        const menuExist = await subCategory.findOne({
            shopId: shopExist.id,
            name: { $regex: new RegExp(`^${submenu}$`, 'i') }
        });
        if(!menuExist){
            return next(new Error(`${submenu} not found!`));
        }
        const getAllMenu = await MenuItem.find({
            subCategoryId: menuExist.id
        });
        Msg(res,'All Menu', getAllMenu);
    }catch(err){
        console.log('err: ',err);
        next(new Error('Error getting menu items!'));
    }
}
module.exports = {
    createCategory, getMainCategory,
    createSubCategory, getSubCategory,
    createMenuItem, getMenuItem,
}