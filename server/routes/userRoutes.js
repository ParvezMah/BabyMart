import express from "express";
import { admin, protect } from "../middleware/authMiddleware.js";
import { createUser, getUsers } from "../controllers/userController.js";

const router = express.Router();

// route
router
    .route("/")
    .get(protect,admin,getUsers)
    .post(protect, admin, createUser);

// /:id 
// /:id/addresses
// /:id/addresses/:addressesId


export default router;