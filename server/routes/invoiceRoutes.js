import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getInvoiceByOrder,
  getUserInvoices,
} from "../controllers/invoiceController.js";

const router = express.Router();

router.get("/order/:orderId", protect, getInvoiceByOrder);
router.get("/my", protect, getUserInvoices);

export default router;