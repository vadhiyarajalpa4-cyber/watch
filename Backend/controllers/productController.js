const Product = require("../models/products");
const fs = require("fs");
const path = require("path");

// const getProducts = async (req, res) => {
//     try {
//         const page = parseInt(req.query.page) || 1;
//         const limit = parseInt(req.query.limit) || 5;
//         const skip = (page - 1) * limit;

//         // Count total documents for frontend pagination buttons
//         const total = await Product.countDocuments();

//         const products = await Product.find({})
//             .populate("category", "name")
//             .skip(skip)
//             .limit(limit);

//         res.json({
//             products,
//             currentPage: page,
//             totalPages: Math.ceil(total / limit),
//             totalProducts: total
//         });
//     } catch (err) {
//         return res.status(500).json({ message: err.message });
//     }
// };

const getProducts = async (req, res) => {
    try {
        const { page, limit, category, style, search } = req.query;
        
        // 1. Build the filter object
        let filter = {};
        
        if (category) filter.category = category;
        if (style && style !== 'All') filter.style = style;
        
        // Add regex for search if a search query exists
        if (search) {
            filter.name = { $regex: search, $options: 'i' };
        }

        // 2. Pagination variables
        const pageNum = parseInt(page) || 1;
        const limitNum = parseInt(limit) || 8;
        const skip = (pageNum - 1) * limitNum;

        // 3. Apply the filter to BOTH the count and the find query
        const total = await Product.countDocuments(filter);
        
        const products = await Product.find(filter)
            .populate("category", "name")
            .skip(skip)
            .limit(limitNum);

        res.json({
            products,
            currentPage: pageNum,
            totalPages: Math.ceil(total / limitNum),
            totalProducts: total
        });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

const getProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id).populate("category", "name"); // 🎯 Tip: Populated here too for frontend display consistency
        if (product) {
            return res.json(product);
        } else {
            return res.status(400).json({ message: "Product Not Found!" });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

// const addProduct = async(req,res)=>{
//     try{
//         const {name,description,price,discountPrice,category,style,warranty,countInStock,brand} = req.body;

//         const existingProduct = await Product.findOne({ name: name });
//         if (existingProduct) {
//             const oldImagePath = path.join(__dirname, '..', existingProduct.image);
//             if (fs.existsSync(oldImagePath)) {
//                 fs.unlinkSync(oldImagePath);
//             }
//             // 🎯 Also clear out existing secondary images if replacing the item entirely
//             if(existingProduct.images && existingProduct.images.length > 0) {
//                 existingProduct.images.forEach(img => {
//                     const extraPath = path.join(__dirname, '..', img);
//                     if (fs.existsSync(extraPath)) fs.unlinkSync(extraPath);
//                 });
//             }
//         }

//         // 🎯 NEW: Read structured multi-upload files from req.files
//         const mainImageFile = req.files && req.files['image'] ? req.files['image'][0] : null;
//         const galleryFiles = req.files && req.files['images'] ? req.files['images'] : [];

//         const imagePath = mainImageFile ? `/uploads/${mainImageFile.filename}` : '';
//         const galleryPaths = galleryFiles.map(file => `/uploads/${file.filename}`);

//         const product = await Product.create({
//             name,
//             description,
//             price: Number(price), // Explicit casting for your updated schema numeric format
//             discountPrice: Number(discountPrice || 0),
//             image: imagePath,
//             images: galleryPaths, // 🎯 NEW: Saving extra angles array
//             category,
//             style,
//             warranty,
//             countInStock,
//             brand
//         });
//         res.status(201).json(product);
//     }catch(err){
//         return res.status(500).json({message:err.message});
//     }
// };
const addProduct = async (req, res) => {
    try {
        const { name, description, category, style, warranty, brand, variants } = req.body;

        // 1. Parse the variants string back into an array
        const parsedVariants = JSON.parse(variants);

        // 2. Process files
        const mainImageFile = req.files?.find(f => f.fieldname === 'image');
        const additionalImages = req.files?.filter(f => f.fieldname === 'images') || [];

        if (!mainImageFile) {
            return res.status(400).json({ message: "Primary product image is required." });
        }

        // 3. Create the product object
        // We assume here that for the initial 'Add' you are sending 1 variant.
        // If you send multiple variants with files, the file mapping logic 
        // would need to be updated to match index to specific files.
        const newProduct = new Product({
            name,
            description,
            category,
            style,
            warranty: warranty || "1 Year International Warranty",
            brand,
            variants: [{
                ...parsedVariants[0], // Spread the parsed data (includes price, color, etc.)
                price: parseFloat(parsedVariants[0].price) || 0,
                discountPrice: parseFloat(parsedVariants[0].discountPrice) || 0,
                countInStock: parseInt(parsedVariants[0].countInStock) || 0,
                image: `/uploads/${mainImageFile.filename}`,
                images: additionalImages.map(f => `/uploads/${f.filename}`)
            }]
        });

        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);

    } catch (err) {
        console.error("Add Product Error:", err);
        res.status(500).json({ message: "Failed to add product", error: err.message });
    }
};
// const addProduct = async (req, res) => {
//     try {
//         const { name, description, category, style, warranty, brand, color,hexCode, price, discountPrice, countInStock } = req.body;

//         // 1. Process files
//         const mainImageFile = req.files?.['image']?.[0];

//         // Validation check for mandatory fields
//         if (!mainImageFile) {
//             return res.status(400).json({ message: "Primary product image is required." });
//         }

//         const additionalImages = req.files?.['images'] || [];

//         // 2. Create the product object
//         const newProduct = new Product({
//             name,
//             description,
//             category,
//             style,
//             warranty: warranty || "1 Year International Warranty",
//             brand,
//             variants: [{
//                 // Use .trim() for clean data
//                 color: color?.trim() || "Standard",
//                 hexCode: hexCode || "#000000" ,
//                 price: Number(price) || 0,
//                 discountPrice: Number(discountPrice) || 0,
//                 countInStock: Number(countInStock) || 0,
//                 image: `/uploads/${mainImageFile.filename}`,
//                 images: additionalImages.map(f => `/uploads/${f.filename}`)
//             }]
//         });

//         // 3. Save and respond
//         const savedProduct = await newProduct.save();
//         // console.log("Saved Product Deatisl:",savedProduct);
//         res.status(201).json(savedProduct);

//     } catch (err) {
//         console.error("Add Product Error:", err);
//         res.status(500).json({ message: "Failed to add product", error: err.message });
//     }
// };

const updateProduct = async (req, res) => {
    try {
        console.log("FILES RECEIVED:", req.files ? req.files.map(f => f.fieldname) : "No files");
        console.log("BODY VARIANTS RECEIVED:", req.body.variants);

        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: "Product not found" });

        // 1. Update basic fields
        product.name = req.body.name || product.name;
        product.description = req.body.description || product.description;
        product.brand = req.body.brand || product.brand;
        product.category = req.body.category || product.category;
        product.style = req.body.style || product.style;
        product.warranty = req.body.warranty || product.warranty;

        // 2. Handle physical deletion of images (Optional but recommended)
        if (req.body.imagesToDelete) {
            const toDelete = JSON.parse(req.body.imagesToDelete);
            toDelete.forEach(filePath => {
                // filePath comes as "/uploads/filename.jpg"
                const fullPath = path.join(__dirname, '..', filePath);
                if (fs.existsSync(fullPath)) {
                    fs.unlinkSync(fullPath);
                }
            });
        }

        // 3. Process Gallery Images
        let updatedGallery = [];
        if (req.body.images) {
            updatedGallery = JSON.parse(req.body.images);
        }

        if (req.files && req.files['images']) {
            const newFilePaths = req.files['images'].map(file => `/uploads/${file.filename}`);
            updatedGallery = [...updatedGallery, ...newFilePaths];
        }
        product.images = updatedGallery;

        // 4. Process Main Thumbnail
        const mainImageFile = req.files?.['image']?.[0];
        if (mainImageFile) {
            product.image = `/uploads/${mainImageFile.filename}`;
        }

        // 5. Handle Variants & Files
        if (req.body.variants) {
            try {
                const incomingVariants = JSON.parse(req.body.variants);

                product.variants = incomingVariants.map((v, index) => {
                    // Check if multer found a file for this specific variant
                    // Note: If you used upload.any(), req.files is an array
                    const variantFile = req.files?.find(f => f.fieldname === `variantImage_${index}`);
                    const variantGalleryFiles = req.files?.filter(f => f.fieldname === `variantGallery_${index}`);

                    console.log(`Mapping Index ${index}: Found main image? ${!!variantFile}, Gallery count: ${variantGalleryFiles?.length}`);

                    const newGalleryPaths = variantGalleryFiles ? variantGalleryFiles.map(file => `/uploads/${file.filename}`) : [];

                    return {
                        color: v.color,
                        hexCode: v.hexCode || "#000000",
                        price: Number(v.price) || 0,
                        discountPrice: Number(v.discountPrice) || 0,
                        countInStock: Number(v.countInStock) || 0,

                        // If a new file was uploaded, use it. Otherwise, keep the old path (v.image)
                        image: variantFile ? `/uploads/${variantFile.filename}` : v.image,

                        // Merge old images with new uploads
                        images: [...(v.images || []), ...newGalleryPaths]
                    };
                });
            } catch (err) {
                return res.status(400).json({ message: "Invalid variants format" });
            }
        }

        // console.log("Saving to Database - First Variant Image:",
        //     product.variants && product.variants.length > 0
        //         ? product.variants[0].image
        //         : "No variants found"
        // );

        // console.log("FINAL VARIANTS DATA TO SAVE:", JSON.stringify(product.variants, null, 2));
        await product.save();
        // console.log("Updated Product Details:",product);
        res.json(product);
    } catch (error) {
        // console.error("Update Product Error:", error);
        res.status(500).json({ message: "Failed to update product", error: error.message });
    }
};
const getRelatedProducts = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: "Product not found" });

        // Improve the filter: 
        // 1. Must match category
        // 2. Ideally, must match 'style' or 'brand' to be truly "related"
        const related = await Product.find({
            category: product.category,
            style: product.style, // <--- Add this to force matching the style (e.g., "Digital" vs "Dress")
            _id: { $ne: req.params.id }
        }).limit(4);

        // If no products match the style, return products from the category only
        if (related.length === 0) {
            const fallback = await Product.find({
                category: product.category,
                _id: { $ne: req.params.id }
            }).limit(4);
            return res.json(fallback);
        }

        res.json(related);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// const updateProduct = async (req, res) => {
//     try {
//         const product = await Product.findById(req.params.id);
//         if (!product) return res.status(404).json({ message: "Product not found" });

//         // Update basic text fields safely
//         product.name = req.body.name || product.name;
//         product.brand = req.body.brand || product.brand;
//         product.price = req.body.price ? Number(req.body.price) : product.price;
//         product.description = req.body.description || product.description;
//         product.category = req.body.category || product.category;
//         product.style = req.body.style || product.style;
//         product.warranty = req.body.warranty || product.warranty;
//         product.countInStock = req.body.countInStock !== undefined ? req.body.countInStock : product.countInStock;
//         product.discountPrice = req.body.discountPrice !== undefined ? Number(req.body.discountPrice) : product.discountPrice;

//         // Process Main Thumbnail Image
//         if (req.files && req.files['image'] && req.files['image'].length > 0) {
//             if (product.image) {
//                 const oldMainPath = path.join(__dirname, '..', product.image);
//                 if (fs.existsSync(oldMainPath)) fs.unlinkSync(oldMainPath);
//             }
//             product.image = `/uploads/${req.files['image'][0].filename}`; 
//         }

//         // Process Gallery Multi-Angle Images safely
//         if (req.files && req.files['images'] && req.files['images'].length > 0) {
//             // Clear out old gallery files from local disk storage folder
//             if (product.images && product.images.length > 0) {
//                 product.images.forEach(img => {
//                     const oldImgPath = path.join(__dirname, '..', img);
//                     if (fs.existsSync(oldImgPath)) fs.unlinkSync(oldImgPath);
//                 });
//             }
//             // 🎯 Fixed Map Array Safely
//             product.images = req.files['images'].map(file => `/uploads/${file.filename}`);
//         }

//         const updatedProduct = await product.save();
//         res.json(updatedProduct);
//     } catch (error) {
//         console.error("Update Error:", error); 
//         res.status(500).json({ message: error.message });
//     }
// };

const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);

        if (!product) return res.status(404).json({ message: "Product not found" });

        // 1. Loop through all variants to gather all image paths
        product.variants.forEach(variant => {
            // Delete main variant image
            if (variant.image) {
                const mainPath = path.join(__dirname, '..', variant.image);
                if (fs.existsSync(mainPath)) fs.unlinkSync(mainPath);
            }

            // Delete gallery images for this variant
            if (variant.images && variant.images.length > 0) {
                variant.images.forEach(img => {
                    const imgPath = path.join(__dirname, '..', img);
                    if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
                });
            }
        });

        // 2. Remove the document from MongoDB
        await Product.findByIdAndDelete(id);

        res.json({ message: "Product and all variant images removed successfully!" });
    } catch (err) {
        console.error("Delete Error:", err);
        res.status(500).json({ message: err.message });
    }
};

module.exports = { getProducts, getProduct, addProduct, updateProduct, getRelatedProducts, deleteProduct };