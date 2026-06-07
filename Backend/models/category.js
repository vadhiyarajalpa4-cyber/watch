const mongoose = require("mongoose");

const categorySchema = mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true,
        trim:true
    },
    subCategories:[{
        type:String,
        trim:true
    }]
},{timestamps:true});

module.exports = mongoose.model("category",categorySchema);