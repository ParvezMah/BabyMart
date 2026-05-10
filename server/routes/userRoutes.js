import express from "express";
import { admin, protect } from "../middleware/authMiddleware.js";
import { createUser, deleteUserById, getUserById, getUsers, updateUserById } from "../controllers/userController.js";

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
// /:id/addresses/:addressesId


export default router;