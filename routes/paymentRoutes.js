import express from "express";
import {
  createPayment,
  getAllPayments,
  getPaymentById,
  updatePaymentStatus,
  deletePayment,
} from "../controllers/payment.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

// ======================================================
// USER PAYMENT ENDPOINTS (HARUS LOGIN)
// ======================================================

// Create payment
router.post("/payments", verifyToken, createPayment);

// Get all payments owned by the logged-in user
router.get("/payments", verifyToken, getAllPayments);

// Get specific payment by ID
router.get("/payments/:id", verifyToken, getPaymentById);

// Update payment status
router.patch("/payments/:id", verifyToken, updatePaymentStatus);

// Delete payment
router.delete("/payments/:id", verifyToken, deletePayment);

export default router;
