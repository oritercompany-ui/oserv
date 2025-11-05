import express from "express";
import {
  createPayment,
  getAllPayments,
  getPaymentById,
  updatePaymentStatus,
  deletePayment,
  getPaymentsProvider,
  confirmPayment,
} from "../controllers/payment.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

// ---------------- USER ENDPOINTS ---------------- //
// Semua endpoint user harus login dulu
router.post("/payments", verifyToken, createPayment);           // Buat pembayaran
router.get("/payments", verifyToken, getAllPayments);           // Get semua pembayaran user
router.get("/payments/:id", verifyToken, getPaymentById);       // Get pembayaran spesifik
router.patch("/payments/:id", verifyToken, updatePaymentStatus);// Update status pembayaran
router.delete("/payments/:id", verifyToken, deletePayment);     // Hapus pembayaran

// ---------------- PROVIDER ENDPOINTS ---------------- //
// Semua endpoint provider harus login dulu
router.get("/provider/payments", verifyToken, getPaymentsProvider);           // Get semua pembayaran
router.patch("/provider/payments/:paymentId/confirm", verifyToken, confirmPayment); // Konfirmasi pembayaran

export default router;
