import asyncHandler from "express-async-handler";
import User from "../models/userModels.js";
import Product from "../models/productModel.js";
import Category from "../models/categoryModel.js";
import Brand from "../models/brandModel.js";
import Order from "../models/orderModel.js"


const getStats = asyncHandler(async (req, res) => {
    const usersCount = await User.countDocuments();
    const productCount = await Product.countDocuments();
    const categoriesCount = await Category.countDocuments();
    const brandsCount = await Brand.countDocuments();
    const ordersCount = await Order.countDocuments();

    const revenueData = await Order.aggregate([
        { $match: { status: { $in: ["paid", "completed", "delivered"]}}},
        { $group: { _id: null, totalRevenue: { $sum: "$total"}}}
    ]);

    const totalRevenue = revenueData[0]?.totalRevenue || 0;

    const roles = await User.aggregate([
        { 
            $group: 
            { 
                _id: "$role", 
                count: { $sum: 1},
            },
        },
    ]);

    const categoryData = await Product.aggregate([
        {
            $lookup: {
                from: "categories",
                localField: "category",
                foreignField: "_id",
                as: "category",
            }
        },
        {
            $unwind: "$categoryInfo",
        },
        {
            $group: {
                _id: "$categoryInfo.name",
                count: { $sum: 1 },
            },
        },
    ]);

    // Get brand distribution
    const brandData = await Product.aggregate([
        {
            $lookup: {
                from: "brands",
                localField: "brand",
                foreignField: "_id",
                as: "brandInfo",
            },
        },
        {
            $unwind: "$brandInfo",
        },
        {
            $group: {
                _id: "$brandInfo.name",
                count: { $sum: 1 },
            },
        },
    ]);

    res.json({
        counts: {
            user: usersCount,
            product: productCount,
            category: categoriesCount,
            brand: brandsCount,
            order: ordersCount,
            totalRevenue: totalRevenue,
        },
        roles: roles.map((role)=> ({
            name: role._id,
            count: role.count,
        })),
        categories: categoryData.map((category) => ({
            name: category._id,
            value: category.count,
        })),
        brands: brandData.map((brand) => ({
            name: brand._id,
            value: brand.count,
        })),
    })


});

export default getStats;