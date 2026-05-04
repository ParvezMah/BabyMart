import asyncHandler from "express-async-handler";

const registerUser = asyncHandler(async (req, res)=> {
    console.log("req", req.body);
    const { name, email, password, role } = req.body;

    res.status(200).json({
        message: "Register route is working",
    })
});


export {
    registerUser
}