import cloudinary from "../config/cloudinary.js";
import Banner from "../models/bannerModel.js";
import asyncHandler from "express-async-handler"

const getBanners = asyncHandler(async (req, res) => {
    const banners = await Banner.find({});
    res.json(banners);
});

const getBannerById = asyncHandler(async (req, res) => {
    const banner = await Banner.findById(req.params.id);
    if (banner) {
        res.json(banner);
    } else {
        res.status(404);
        throw new Error("Banner not found");
    }
});

const createBanner = asyncHandler(async (req, res) => {
    const { name, title, startFrom, image, bannerType } = req.body;

    let imageUrl = "";
    if (image) {
        // upload image to cloudinary
        const result = await cloudinary.uploader.upload(image, {
            folder: "admin-dashboards/banners",
        });
        imageUrl = result.secure_url;
    }

    const banner = new Banner({
        name,
        title,
        startFrom,
        image: imageUrl || undefined,
        bannerType,
    });
    const createdBanner = await banner.save();

    if (createdBanner) {
        res.status(201).json({
            success: true,
            createdBanner,
        });
    } else {
        res.status(400);
        throw new Error("Invalid banner data");
    }
});

const updateBannerById = asyncHandler(async (req, res) => {
    const { name, title, startFrom, image, bannerType } = req.body;

    const banner = await Banner.findById(req.params.id);

    if (!banner) {
        res.status(404);
        throw new Error("Banner not found");
    }

    if (banner) {
        banner.name = name || banner.name;
        banner.title = title || banner.title;
        banner.startFrom = startFrom || banner.startFrom;
        banner.bannerType = bannerType || banner.bannerType;

        try {
            if (image !== undefined) {
                if (image) {
                    const result = await cloudinary.uploader.upload(image, {
                        folder: "admin-dashboards/banners",
                    });
                    banner.image = result.secure_url;
                } else {
                    banner.image = undefined;
                }
            }

            const updatedBanner = await banner.save();
            res.json(updatedBanner);
        } catch (error) {
            if(error.name === "ValidationError"){
                const errors = Object.values(error.errors).forEach((err)=> err.message);
                res.status(400);
                throw new Error(errors.join(","));
            }
            res.status(400);
            throw new Error("Invalid Banner Data");
        }
    } else {
        res.status(404);
        throw new Error("Banner not found");
    }
});

const deleteBannerById = asyncHandler(async (req, res) => {
    const banner = await Banner.findById(req.params.id);
    if(banner){
        await banner.deleteOne();
        res.json({ message: "Banner deleted successfully" });
    } else {
        res.status(404);
        throw new Error("Banner not found");
    }
});

export { 
    getBanners,
    getBannerById,
    createBanner,
    updateBannerById,
    deleteBannerById
 };