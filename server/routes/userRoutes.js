import express from "express";
import { admin, protect } from "../middleware/authMiddleware.js";
import { getUsers } from "../controllers/userController.js";

const router = express.Router();

// route
router.route("/").get(protect,admin,getUsers)

// /:id 
// /:id/addresses
// /:id/addresses/:addressesId


export default router;