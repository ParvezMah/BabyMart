import asyncHandler from "express-async-handler";
import Brand from "../models/brandModel.js";
import cloudinary from "../config/cloudinary.js";


const getBrands = asyncHandler(async (req, res)=> {
    const brands = await Brand.find({});
    res.json(brands);
});


const getBrandById = asyncHandler(async (req, res)=> {
    const brand = await Brand.findById(req.params.id);
    if(brand){
        res.json(brand);
    } else {
        res.status(404);
        throw new Error("Brand not found");
    }
});

const createBrand = asyncHandler(async (req, res)=> {
    const { name, image } = req.body;
    const brandExists = await Brand.findOne({ name });
    if(brandExists){
        res.status(400);
        throw new Error("Brand already exists");
    }

    let imageUrl = "";
    if(image){
        // upload image to cloudinary
        const result = await cloudinary.uploader.upload(image, {
            folder: "admin-dashboards/brands",
        });
        imageUrl = result.secure_url;
    };

    const brand = await Brand.create({
        name,
        image: imageUrl || undefined,
    })

    if(brand){
        res.status(201).json({
            success: true,
            brand,
        })
    } else {
        res.status(400);
        throw new Error("Invalid brand data");
    }
});


const updateBrandById = asyncHandler(async (req, res)=> {
    const { name, image } = req.body;
    const brand = await Brand.findById(req.params.id);
    if(brand){
        brand.name = name || brand.name;
        if(image !== undefined){
            if(image){
                const result = await cloudinary.uploader.upload(image, {
                    folder: "admin-dashboard/brands",
                });
                brand.image = result.secure_url;
            } else {
                brand.image = undefined;
            }
        }

        const updatedBrand = await brand.save();
        res.json(updatedBrand);
    } else {
        res.status(404);
        throw new Error("Brand not found");
    }
});


const deleteBrandById = asyncHandler(async (req, res)=> {
    const brand = await Brand.findById(req.params.id);
    if(brand){
        await brand.deleteOne();
        res.json({
            success: true,
            message: "Brand deleted successfully"
        })
    } else {
        res.status(404);
        throw new Error("Brand not found");
    }
});

export {
    getBrands,
    getBrandById,
    updateBrandById,
    deleteBrandById,
    createBrand,
}