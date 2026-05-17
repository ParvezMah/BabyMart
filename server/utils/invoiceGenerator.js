// utils/invoiceGenerator.js
import Invoice from "../models/invoiceModel.js";

export const generateInvoice = async (order) => {
  const invoiceNumber = `INV-${Date.now()}`;

  const subtotal = order.items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const tax = subtotal * 0.05; // 5% tax example
  const total = subtotal + tax;

  const invoice = await Invoice.create({
    orderId: order._id,
    userId: order.userId,
    invoiceNumber,
    items: order.items,
    subtotal,
    tax,
    total,
  });

  return invoice;
};