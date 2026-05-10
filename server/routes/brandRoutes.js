import express from "express";
import { admin, protect } from "../middleware/authMiddleware.js";
import { createBrand, deleteBrandById, getBrandById, getBrands, updateBrandById } from "../controllers/brandController.js";


const router = express.Router();

router.route("/").get(getBrands).post(protect, admin, createBrand);

router
    .route("/:id")
    .get(getBrandById)
    .put(protect, admin, updateBrandById)
    .delete(protect, admin, deleteBrandById);


export default router;