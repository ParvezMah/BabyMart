import asyncHandler from "express-async-handler";
import User from "../models/userModels.js";
import generateToken from "../utils/generateToken.js";

const registerUser = asyncHandler(async (req, res)=> {
    console.log("req", req.body);
    const { name, email, password, role } = req.body;

    const userExists = await User.findOne({ email});

    if (userExists) {
        res.status(400);
        throw new Error("User already exists, Try login");
    };

    const user = await User.create({
        name,
        email,
        password,
        role,
        addresses: [],
        // wishlist: [],
        // cart: [],
        // orders: [],
    })

    if(user){
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            role: user.role,
            addresses: user.addresses,
        })
    } else {
        res.status(400);
        throw new Error("Invalid user Data");
    }
});


const loginUser = asyncHandler(async (req, res)=> {
    const { email, password } = req.body;
    const user = await User.findOne({email})
    if(user && (await user.matchPassword(password))){
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            role: user.role,
            addresses: user.addresses || [],
            token: generateToken(user._id),
        })
    } else {
        res.status(400);
        throw new Error("Invalid email or password");
    }
})



export {
    registerUser,
    loginUser
}