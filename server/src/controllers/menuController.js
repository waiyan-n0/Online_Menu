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

const createMenuItem = async (req, res, next) => {
    try {
        const { slug, submenu } = req.params;
        const { name, price } = req.body;

        let imageUrl = "";
        let deleteUrl = "";

        if (req.file) {
            const base64Image = req.file.buffer.toString('base64');
            const formData = new URLSearchParams();
            formData.append('image', base64Image);

            const imgbbResponse = await fetch(`https://api.imgbb.com/1/upload?key=${process.env.IMGBB_API_KEY}`,
                {
                    method: 'POST',
                    body: formData,
                }
            );

            const imgbbData = await imgbbResponse.json();
            if (!imgbbData.success) {
                return next(new Error('Failed to upload image to ImgBB!'));
            }
            imageUrl = imgbbData.data.display_url;
            deleteUrl = imgbbData.data.delete_url;
        }

        if (!name || price === undefined) {
            return next(new Error('Name and price are required!'));
        }

        const shopExist = await shop.findOne({ slug });
        if (!shopExist) {
            return next(new Error('Shop not found!'));
        }

        const decodedSubmenu = decodeURIComponent(submenu);
        const menuExist = await subCategory.findOne({
            shopId: shopExist.id,
            name: { $regex: new RegExp(`^${decodedSubmenu}$`, 'i') }
        });

        if (!menuExist) {
            return next(new Error('Subcategory not found!'));
        }

        const itemExist = await MenuItem.findOne({
            shopId: shopExist.id,
            subCategoryId: menuExist.id,
            name
        });

        if (itemExist) {
            return next(new Error(`${name} already exists in this subcategory!`));
        }

        const newItem = await MenuItem.create({
            shopId: shopExist.id,
            categoryId: menuExist.categoryId,
            subCategoryId: menuExist.id,
            name: name,
            price: Number(price),
            image: imageUrl,
            deleteUrl: deleteUrl
        });
        Msg(res, 'Menu created Successfully!', newItem);
    } catch (err) {
        console.log('err: ', err);
        next(new Error('Error creating menu item!'));
    }
};
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

const deleteMenu = async (req, res, next) => {
    try {
        const { id } = req.body;
        const { slug } = req.params;

        const shopExist = await shop.findOne({ slug: slug });
        if (!shopExist) {
            return next(new Error('Shop not found!'));
        }

        const menuItem = await MenuItem.findById(id);
        if (!menuItem) {
            return next(new Error('Error deleting! Item not found!'));
        }

        // Delete image from ImgBB if deleteUrl exists
        if (menuItem.deleteUrl) {
            try {
                const urlParts = menuItem.deleteUrl.split('/');
                const imageId = urlParts[3];
                const imageHash = urlParts[4];

                if (imageId && imageHash) {
                    const formData = new URLSearchParams();
                    formData.append('action', 'delete');
                    formData.append('delete', 'image');
                    formData.append('from', 'resource');
                    formData.append('deleting[id]', imageId);
                    formData.append('deleting[hash]', imageHash);

                    await fetch('https://ibb.co/json', {
                        method: 'POST',
                        body: formData,
                    });
                }
            } catch (imgErr) {
                console.log("Could not delete image from ImgBB (non-blocking):", imgErr.message);
            }
        }
        await MenuItem.deleteOne({ _id: id });
        Msg(res, 'Deleted menu successfully!', menuItem);
    } catch (err) {
        console.log('Error deleting menu: ', err);
        next(new Error('Error deleting menu'));
    }
};
const deleteSubCategory = async(req, res, next) =>{
    try{
        const {slug} = req.params;
        const { id } = req.body;
        const shopExist =await shop.findOne({slug: slug});
        if(!shopExist){
            return next(new Error('Error deleting! Shop not found!'));
        }
        const isExist = await subCategory.findById(id);
        if(!isExist){
            return next(new Error('Error deleting! Category not found!'));
        }
        await MenuItem.deleteMany({ subCategoryId: id });
        const deleted = await subCategory.deleteOne({_id: id});
        if(!deleted){
            return next(new Error('Error deleting menu!'));
        }
        Msg(res,'Deleted sub category!', deleted);
    }catch(err){
        console.log('Error deleting category: ',err);
        next(new Error('Error deleting category'));
    }
}
const deleteCategory = async(req, res, next) =>{
    try{
        const { id } = req.body;
        const {slug} = req.params;
        const shopExist = await shop.findOne({slug: slug});
        if(!shopExist){
            return next(new Error('Shop not found!'));
        }
        const isExist = await Category.findById(id);
        if(!isExist){
            return next(new Error('Error deleting! Category not found!'));
        }
        const subcategories = await subCategory.find({categoryId: id});
        const subIds = subcategories.map(sub=> sub.id);
        if (subIds.length > 0) {
            await MenuItem.deleteMany({ subCategoryId: { $in: subIds } });
        }
        await subCategory.deleteMany({ categoryId: id });

        const deleted = await Category.deleteOne({_id: id});
        if(!deleted){
            return next(new Error('Error deleting Category!'));
        }
        Msg(res,'Category Deleted!', deleted);
    }catch(err){
        console.log('Error deleting Category: ',err);
        next(new Error('Error deleting Category'));
    }
}

module.exports = {
    createCategory, getMainCategory,
    createSubCategory, getSubCategory,
    createMenuItem, getMenuItem,
    deleteMenu, deleteSubCategory, deleteCategory
}