// const mongoose = require("mongoose");

// const productSchema = mongoose.Schema({
//     name:{
//         type:String,
//         required:true
//     },
//     description:{
//         type:String,
//         required:true
//     },
//     price:{
//         type:Number, // 🎯 CHANGED: String to Number for safe math/sorting operations
//         required:true
//     },
//     discountPrice:{
//         type:Number,
//         default:0
//     },
//     image:{
//         type:String, // Main primary thumbnail image
//         required:true
//     },
//     images:[{ 
//         type:String // 🎯 NEW: Array of strings to store multiple views of the watch
//     }],
//     category:{
//         type:mongoose.Schema.Types.ObjectId,
//         ref: "category",
//         required:true
//     },
//     style:{
//         type:String, // e.g., 'Dress', 'Sports', 'Chronograph'
//         required:true
//     },
//     warranty:{
//         type:String,
//         default: "1 Year International Warranty"
//     },
//     countInStock:{
//         type:Number,
//         required:true,
//         default:0
//     },
//     brand:{
//         type:String,
//         required:true
//     }
// },{
//     timestamps: true
// });

// module.exports = mongoose.model("product",productSchema);


const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "category", required: true },
    brand: { type: String, required: true },
    style: { type: String, required: true },
    warranty: { type: String, default: "1 Year International Warranty" },

    // 🎯 The Magic Fix: Variants Array
    variants: [{
        color: { type: String, required: true }, // e.g., "Blue", "Green"
        hexCode: { type: String, default: "#000000" },
        price: { type: Number, required: true },
        discountPrice: { type: Number, default: 0 },
        countInStock: { type: Number, default: 0 },
        image: { type: String, required: false }, // Specific image for THIS color
        images: [String] // Specific gallery for THIS color
    }]
}, { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
 });

 productSchema.virtual('mainImage').get(function() {
    return this.variants && this.variants.length > 0 ? this.variants[0].image : null;
});

productSchema.virtual('mainPrice').get(function() {
    return this.variants && this.variants.length > 0 ? this.variants[0].price : null;
});

module.exports = mongoose.model("product", productSchema);