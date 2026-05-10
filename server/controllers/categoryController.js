import asyncHandler from "express-async-handler";
import Category from "../models/categoryModel.js";
import cloudinary from "../config/cloudinary.js";

const getCategories = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 20;
    const sortOrder = req.query.sortOrder || "asc";


    if(page < 1 || perPage < 1){
        res.status(400);
        throw new Error("Invalid page or perPage value");
    }

    if(!["asc", "desc"].includes(sortOrder)){
        res.status(400);
        throw new Error("Sort Order must be 'asc' or 'desc'");
    }

    const skip = (page-1) * perPage;
    const total = await Category.countDocuments({});
    const sortValue = sortOrder === "asc" ? 1 : -1;

    const categories = await Category.find({})
        .skip(skip)
        .limit(perPage)
        .sort({ createdAt: sortValue }); // sort by createdAt

    const totalPages = Math.ceil(total / perPage);

    res.json({
        success: true,
        categories,
        total,
        page,
        perPage,
        totalPages,
    })
});


const getCategoryById = asyncHandler(async (req, res) => {
    const category = await Category.findById(req.params.id);

    if(category){
        res.json(category);
    } else {
        res.status(404);
        throw new Error("Category not found");
    }
});


const createCategory = asyncHandler(async (req, res) => {
    const { name, image, categoryType } = req.body;
    if(!name || typeof name !== "string"){
        res.status(400);
        throw new Error("Name is required and must be a string");
    }

    // Validate categoryType
    const validCategoryTypes = ["Featured", "Hot Categories", "Top Categories"];
    if(!validCategoryTypes.includes(categoryType)){
        res.status(400);
        throw new Error("Invalid category type");
    }

    const categoryExists = await Category.findOne({ name });
    if(categoryExists){
        res.status(400);
        throw new Error("Category already exists");
    }

    let imageUrl = "";
    if(image){
        // upload image to cloudinary
        const result = await cloudinary.uploader.upload(image, {
            folder: "admin-dashboards/categories",
        });
        imageUrl = result.secure_url;
    };

    const category = await Category.create({
        name,
        image: imageUrl || undefined,
        categoryType,
        });
    if(category){
        res.status(201).json({
            success: true,
            category,
        })
    } else {
        res.status(400);
        throw new Error("Invalid category data");
    }

});

const updateCategoryById = asyncHandler(async (req, res) => {
    const { name, image, categoryType } = req.body;

    // validate categoryType
    const validCategoryTypes = ["Featured", "Hot Categories", "Top Categories"];
    if(categoryType && !validCategoryTypes.includes(categoryType)){
        res.status(400);
        throw new Error("Invalid category type");
    }

    const category = await Category.findById(req.params.id);
    if(category){
        category.name = name || category.name;
        category.categoryType = categoryType || category.categoryType;

        if(image){
            const result = await cloudinary.uploader.upload(image, {
                folder: "admin-dashboards/categories",
            });
            category.image = result.secure_url;
        } else {
            category.image = undefined;
        }

        const updatedCategory = await category.save();
        res.json(updatedCategory);
    } else {
        res.status(404);
        throw new Error("Category not found");
    }

});

export {
    getCategories,
    getCategoryById,
    createCategory,
    updateCategoryById
}