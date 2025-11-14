import express from "express";
import {
  getOrders,           // ambil semua order
  confirmOrder,        // konfirmasi order
  logoutUser,          // logout provider/user
  updateOrderStatus,   // update status order
  getPayments,         // ambil semua pembayaran
  confirmPayment,      // konfirmasi pembayaran
} from "../controllers/provider.js"; // pastikan file controller sesuai
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

// 🔹 Ambil semua order provider
router.get("/provider/orders", verifyToken, getOrders);

// 🔹 Konfirmasi order (ubah status jadi in_progress)
router.patch("/provider/orders/:id/confirm", verifyToken, confirmOrder);

// 🔹 Update status order manual (in_progress → completed)
router.patch("/provider/orders/:id/status", verifyToken, updateOrderStatus);

// 🔹 Ambil semua pembayaran untuk provider
router.get("/provider/payments", verifyToken, getPayments);

// 🔹 Konfirmasi pembayaran (ubah transaction_status jadi Success)
router.patch("/provider/payments/:paymentId/confirm", verifyToken, confirmPayment);

// 🔹 Logout provider
router.delete("/provider/logout", verifyToken, logoutUser);

export default router;
