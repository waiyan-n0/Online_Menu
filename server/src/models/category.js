const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
    shopId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "shop",
        required: true
    },
    name: {type: String, required: true},
    order: {type: Number, default: 0},
}, {timestamps: true});

const category = mongoose.model('category', categorySchema);
module.exports = category;