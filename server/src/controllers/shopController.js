const shop = require('../models/shopData');
const { Msg } = require("../utils/helper");

const createShop = async (req, res, next) => {
    const { shopName, slug, tag, location, phones, socials, logoFile, username, password } = req.body;

    try {
        const shopExist = await shop.findOne({ slug });
        if (shopExist) {
            return next(new Error('Restaurant with this slug already exists!'));
        }

        const newShop = await shop.create({
            name: shopName,
            slug,
            tag,
            location,
            phone: phones,
            logo: logoFile,
            socialMedia: socials,
            adminUsername: username,
            adminPassword: password
        });

        Msg(res, `New shop (${shopName}) created successfully!`, newShop);
    } catch (err) {
        console.log(err);
        next(new Error('Failed to create shop'));
    }
};
const getAllShops = async (req, res, next) => {
    try {
        const all = await shop.find();
        if (!all || all.length === 0) {
            return next(new Error('No shops found.'));
        }
        Msg(res, 'All existing shops.', all);
    } catch (err) {
        console.error(err);
        next(new Error('Error getting all shops'));
    }
};
// const getShopDetailsBySlug = async (req, res, next) =>{
//     try{
//         const slug = req.params.slug;
//         const slugExist = await shop.findOne({slug});
//         if(!slugExist){
//             return next(new Error(`${slug} not found!`));
//         }
//         Msg(res, 'Shop found.', slugExist);
//     }catch(err){
//         console.log('Error: ',err);
//         next(new Error('Error getting shop details!'));
//     }
// }
const getShopDetailsBySlug = async (req, res, next) =>{
    try{
        const slug = req.params.slug;
        const shopExist = await shop.findOne({slug});
        if(!shopExist){
            return next(new Error(`${slug} not found!`));
        }
        req.shop = shopExist;
        next();
        //Msg(res, 'Shop found.', shopExist);
    }catch(err){
        console.log('Error: ',err);
        next(new Error('Error getting shop details!'));
    }
}
const shopLogin = async (req, res, next) => {
    const {username, password} = req.body;
    const isExist = await shop.findOne({adminUsername: username, adminPassword: password});
    if(!isExist){
        return next(new Error(`${username} not found!`));
    }
    Msg(res,'Login Success!', isExist);
}

module.exports = {
    createShop, getAllShops, getShopDetailsBySlug, shopLogin
};