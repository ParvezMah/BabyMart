import express from "express";
import { admin, protect } from "../middleware/authMiddleware.js";
import { addAddress, createUser, deleteAddress, deleteUserById, getUserById, getUsers, updateAddress, updateUserById } from "../controllers/userController.js";

const router = express.Router();

// route
router
    .route("/")
    .get(protect,admin,getUsers)
    .post(protect, admin, createUser);

// /:id 
router
    .route("/:id")
    .get(protect, getUserById)
    .put(protect, updateUserById)
    .delete(protect, admin, deleteUserById);


// /:id/addresses
router
    .route("/:id/addresses")
    .post(protect, addAddress);


// /:id/addresses/:addressesId
router
    .route("/:id/addresses/:addressId")
    .put(protect, updateAddress)
    .delete(protect, deleteAddress);


export default router;