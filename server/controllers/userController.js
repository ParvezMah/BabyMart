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

// getUserById
const getUserById = asyncHandler(async (req, res)=>{
    const user = await User.findById(req.params.id).select("-password");
    if(user){
        res.json(user);
    } else {
        res.status(404);
        throw new Error("User not found");
    }
})

// updateUserById
const updateUserById = asyncHandler(async (req, res)=>{
    const user = await User.findById(req.params.id);

    if(!user){
        res.status(404);
        throw new Error("User not found");
    }

    // Allow updates by the user themselves or admins
    user.name = req.body.name || user.name;
    if(req.body.password) {
        user.password = req.body.password;
    }
    if(req.body.role) {
        user.role = req.body.role;
    }
    user.addresses = req.body.addresses || user.addresses;

    // avatar
    const updateUserById = await user.save();

    res.status(200).json({
        message: "User updated successfully",
        _id: updateUserById._id,
        name: updateUserById.name,
        email: updateUserById.email,
        avatar: updateUserById.avatar,
        role: updateUserById.role,
        addresses: updateUserById.addresses,
    })


});

export {
    getUsers,
    createUser,
    getUserById,
    updateUserById,
}