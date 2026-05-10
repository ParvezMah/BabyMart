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

// deleteUserById
const deleteUserById = asyncHandler(async (req, res)=>{
    const user = await User.findById(req.params.id);


    if(user){
        // Delete user's cart
        // Delete user's order (if extists)
        // Delete user
        await user.deleteOne();
        res.status(200).json({
            success: true,
            message: "User deleted successfully"
        })
    }
    else {
        res.status(404);
        throw new Error("User not found");
    }
});

// addAddress
const addAddress = asyncHandler(async (req, res)=>{
    const user = await User.findById(req.params.id);

    if(!user){
        res.status(404);
        throw new Error("User not found");
    }

    if (
        user._id.toString() !== req.user._id.toString() &&
        req.user.role !== "admin"
    ){
        res.status(403);
        throw new Error("Not authorized to modify this user's addresses");
    }

    const { street, city, country, postalCode, isDefault } = req.body;

    if(!street || !city || !country || !postalCode){
        res.status(400);
        throw new Error("All addresses fields are required");
    }

    // if this is set as default, make other addresses non-default
    if(isDefault){
        user.addresses.forEach((address)=>{
            address.isDefault = false;
        });
    };

    if(user.addresses.length === 0 ){
        user.addresses.push({
            street,
            city,
            country,
            postalCode,
            isDefault: true,
        });
    } else {
        user.addresses.push({
            street,
            city,
            country,
            postalCode,
            isDefault: isDefault || false,
        })
    }

    await user.save();

    res.json({
        success: true,
        addresses: user.addresses,
        message: "Address added successfully",
    });
});

// updateAddress
const updateAddress= asyncHandler(async (req, res)=>{
    const user = await User.findById(req.params.id);

    if(!user){
        res.status(404);
        throw new Error("User not found");
    };

    if (
        user._id.toString() !== req.user._id.toString() &&
        req.user.role !== "admin"
    ){
        res.status(403);
        throw new Error("Not authorized to modify this user's addresses");
    };

    const address = user.addresses.id(req.params.addressId);

    if(!address){
        res.status(404);
        throw new Error("Address not found");
    };

    const { street, city, country, postalCode, isDefault } = req.body;

    if (street) address.street = street;
    if (city) address.city = city;
    if (country) address.country = country;
    if (postalCode) address.postalCode = postalCode;

    // if this is set as default, make other addresses non-default
    if(isDefault){
        user.addresses.forEach((address)=>{
            address.isDefault = false;
        });
        address.isDefault = true;
    };


    await user.save();

    res.json({
        success: true,
        addresses: user.addresses,
        message: "Address updated successfully",
    });
});


// deleteAddress
const deleteAddress= asyncHandler(async (req, res)=>{
    const user = await User.findById(req.params.id);

    if(!user){
        res.status(404);
        throw new Error("User not found");
    };

    if (
        user._id.toString() !== req.user._id.toString() &&
        req.user.role !== "admin"
    ){
        res.status(403);
        throw new Error("Not authorized to modify this user's addresses");
    };
    
    const address = user.addresses.id(req.params.addressId);

    if(!address){
        res.status(404);
        throw new Error("Address not found");
    };

    const wasDefault = address.isDefault;
    user.addresses.pull(req.params.addressId);

    if(wasDefault && user.addresses.lenght > 0 ){
        use.addresses[0].isDefault = true;
    }

    await user.save();

    res.json({
        success: true,
        addresses: user.addresses,
        message: "Address deleted successfully",
    })
});

export {
    getUsers,
    createUser,
    getUserById,
    updateUserById,
    deleteUserById,
    addAddress,
    updateAddress,
    deleteAddress,
}