// const mongoose = require("mongoose");

// const wishlistSchema = mongoose.Schema({
//     user:{
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "user",
//         required:true
//     },
//     products:{
//         type:mongoose.Schema.Types.ObjectId,
//         ref:"product",
//         required:true
//     }
// },
// {timestamps:true}
// );

// module.exports = mongoose.model("wishlist",wishlistSchema);

const mongoose = require("mongoose");

const wishlistSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    // Change: Store an array of items
    items: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "product",
                required: true
            },
            variantIndex: {
                type: Number,
                default: 0 // Track which color variant they liked
            }
        }
    ]
}, { timestamps: true });

module.exports = mongoose.model("wishlist",wishlistSchema);
