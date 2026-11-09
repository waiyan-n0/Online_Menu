const mongoose = require("mongoose");

const subCategorySchema = new mongoose.Schema({
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
    name: { type: String, required: true },
    order: { type: Number, default: 0 },
}, { timestamps: true });

const subCategory = mongoose.model('subCategory', subCategorySchema);
module.exports = subCategory;