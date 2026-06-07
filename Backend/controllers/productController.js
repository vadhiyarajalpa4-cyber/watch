const Product = require("../models/products");
const fs = require("fs");
const path = require("path");

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

        const mainImageFile = req.files?.['image']?.[0];
        if (mainImageFile) {
            product.image = `/uploads/${mainImageFile.filename}`;
        }

        if (req.body.variants) {
            try {
                const incomingVariants = JSON.parse(req.body.variants);

                product.variants = incomingVariants.map((v, index) => {
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

                        image: variantFile ? `/uploads/${variantFile.filename}` : v.image,

                        images: [...(v.images || []), ...newGalleryPaths]
                    };
                });
            } catch (err) {
                return res.status(400).json({ message: "Invalid variants format" });
            }
        }

        
        await product.save();
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: "Failed to update product", error: error.message });
    }
};
const getRelatedProducts = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: "Product not found" });

        const related = await Product.find({
            category: product.category,
            style: product.style,
            _id: { $ne: req.params.id }
        }).limit(4);

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

const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);

        if (!product) return res.status(404).json({ message: "Product not found" });

        product.variants.forEach(variant => {
            if (variant.image) {
                const mainPath = path.join(__dirname, '..', variant.image);
                if (fs.existsSync(mainPath)) fs.unlinkSync(mainPath);
            }

            if (variant.images && variant.images.length > 0) {
                variant.images.forEach(img => {
                    const imgPath = path.join(__dirname, '..', img);
                    if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
                });
            }
        });

        await Product.findByIdAndDelete(id);

        res.json({ message: "Product and all variant images removed successfully!" });
    } catch (err) {
        console.error("Delete Error:", err);
        res.status(500).json({ message: err.message });
    }
};

module.exports = { getProducts, getProduct, addProduct, updateProduct, getRelatedProducts, deleteProduct };