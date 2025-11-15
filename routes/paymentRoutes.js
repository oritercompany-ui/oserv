import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";

import {
  createPayment,
  getPaymentsByUser,
  getPaymentById,
  updatePaymentStatus,
} from "../controllers/payment.js";

const router = express.Router();

// ===============================
// PAYMENT ROUTES (USER)
// ===============================

// 🔹 Buat pembayaran
router.post("/payments", verifyToken, createPayment);

// 🔹 Ambil semua pembayaran user
router.get("/payments", verifyToken, getPaymentsByUser);

// 🔹 Ambil 1 pembayaran spesifik
router.get("/payments/:id", verifyToken, getPaymentById);

// 🔹 Update status pembayaran (optional dipakai provider/admin)
router.patch("/payments/:id", verifyToken, updatePaymentStatus);

export default router;
