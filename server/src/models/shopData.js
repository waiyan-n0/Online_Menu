const mongoose = require('mongoose');

const shopDataSchema = new mongoose.Schema({
    name: {type: String, required: true},
    slug: {type: String, required: true, unique: true},
    tag: {type: String},
    location: {type: String},
    phone: {type: [String]},
    logo: {type: String},
    socialMedia: {type: [String]},
    adminUsername: { type: String, required: true },
    adminPassword: { type: String, required: true },
}, {timestamps: true});

//console.trace('--- SHOP MODEL IS BEING COMPILED HERE ---');

const shop = mongoose.model('shop', shopDataSchema);

module.exports = shop;