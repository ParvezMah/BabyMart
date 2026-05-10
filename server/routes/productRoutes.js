import express from "express";
import { admin, protect } from "../middleware/authMiddleware.js";
import { createProduct, getProducts } from "../controllers/productController.js";


const router = express.Router();

router.route("/").get(protect, admin, getProducts)

router.route("/").post(protect, admin, createProduct);


export default router;