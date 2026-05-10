import express from "express";
import { admin, protect } from "../middleware/authMiddleware.js";
import { createProduct, deleteProduct, getProductById, getProducts, rateProduct, updateProduct } from "../controllers/productController.js";


const router = express.Router();

router.route("/").get(protect, admin, getProducts)

router.route("/").post(protect, admin, createProduct);

router
  .route("/:id")
  .get(getProductById)
  .put(protect, admin, updateProduct)
  .delete(protect, admin, deleteProduct);

router.route("/:id/rate").post(protect, rateProduct);


export default router;