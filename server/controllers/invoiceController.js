// controllers/invoiceController.js
import asyncHandler from "express-async-handler";
import Invoice from "../models/invoiceModel.js";

// Get invoice by order
export const getInvoiceByOrder = asyncHandler(async (req, res) => {
  const invoice = await Invoice.findOne({
    orderId: req.params.orderId,
  });

  if (!invoice) {
    res.status(404);
    throw new Error("Invoice not found");
  }

  res.json({
    success: true,
    invoice,
  });
});

// Get user invoices
export const getUserInvoices = asyncHandler(async (req, res) => {
  const invoices = await Invoice.find({
    userId: req.user._id,
  }).sort({ createdAt: -1 });

  res.json({
    success: true,
    invoices,
  });
});