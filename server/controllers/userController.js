import asyncHandler from "express-async-handler";
import User from "../models/userModels.js";


// getUsers


const getUsers = asyncHandler(async (req, res)=>{
    const users = await User.find({}).select("-password");
    res.status(200).json({
        success: true,
        users
    })
})



const createUser = asyncHandler(async (req, res)=>{
    const { name, email, password, role, addresses } = req.body;
    const userExists = await User.findOne({ email});
    if (userExists) {
        res.status(400);
        throw new Error("User already exists");
    }

    const user = await User.create({
        name,
        email,
        password,
        role,
        addresses: addresses || [],
    })

    if (user){
        // Initialize empty cart
        // await Cart.create({ userId: user._id, items: [] });

        res.status(200).json({
            _id:user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            role: user.role,
            addresses: user.addresses,
        })
    }
    else {
        res.status(400);
        throw new Error("Invalid User Data");
    }
})

export {
    getUsers,
    createUser,
}