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

export {
    getUsers
}