const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
    shopId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "shop",
        required: true
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "category",
        required: true
    },
    subCategoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "subCategory",
        required: true
    },
    name: {type: String, required: true},
    price: {type: Number, required: true},
    //description: {type: String, required: true},
    image: {type: String},
    deleteUrl: {type: String, default: ''},
}, {timestamps: true});

const menuItem = mongoose.model('menuItem', menuItemSchema);
module.exports = menuItem;