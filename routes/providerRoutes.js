import express from "express";
import {
  getOrders,          // Ambil semua order provider
  confirmOrder,       // Konfirmasi order → on_progress
  updateOrderStatus,  // Update status order
  getPayments,        // Ambil semua pembayaran provider
  confirmPayment,     // Konfirmasi pembayaran
  logoutUser,         // Logout provider
} from "../controllers/provider.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

// ======================================================
// PROVIDER ORDER ROUTES
// ======================================================

// Get all provider orders
router.get("/provider/orders", verifyToken, getOrders);

// Confirm order (set status → on_progress)
router.patch("/provider/orders/:uuid/confirm", verifyToken, confirmOrder);

// Update order status (ex: on_progress → finished)
router.patch("/provider/orders/:uuid/status", verifyToken, updateOrderStatus);

// ======================================================
// PROVIDER PAYMENT ROUTES
// ======================================================

// Get all payments for provider
router.get("/provider/payments", verifyToken, getPayments);

// Confirm payment (transaction_status → Success)
router.patch("/provider/payments/:paymentId/confirm", verifyToken, confirmPayment);

// ======================================================
// PROVIDER ACCOUNT
// ======================================================

// Logout provider
router.delete("/provider/logout", verifyToken, logoutUser);

export default router;
