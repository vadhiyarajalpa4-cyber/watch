const Category = require("../models/category");

const getCategory = async(req,res)=>{
    try{
        const categories = await Category.find({});
        res.json(categories);
    }catch(err){
        return res.status(500).json({message:err.message});
    }
};

const createCategory = async(req,res)=>{
    try{
        const {name,subCategories} = req.body;

        const categoryExist = await Category.findOne({name});
        if(categoryExist){
            return res.status(400).json({message:"Category already exists"});
        }

        const category = await Category.create({
            name,
            subCategories
        });
        res.status(201).json(category);
    }catch(err){
        return res.status(500).json({message:err.message});
    }
};

const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, subCategories } = req.body;

        // Find and update the category
        const updatedCategory = await Category.findByIdAndUpdate(
            id,
            { name, subCategories },
            { new: true, runValidators: true }
        );

        if (!updatedCategory) {
            return res.status(404).json({ message: "Category not found" });
        }

        res.json(updatedCategory);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

const deleteCategory = async(req,res)=>{
    try{
        const {id} = req.params;
            await Category.findByIdAndDelete(id);
            res.json({message:"Category Removed"});
    }catch(err){
        return res.status(500).json({message:err.message});
    }
};

module.exports = {getCategory, createCategory, updateCategory,deleteCategory };
