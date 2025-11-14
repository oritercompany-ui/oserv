import express from "express";
import {
  getOrders,           // ambil semua order provider
  confirmOrder,        // konfirmasi order (ubah status jadi on_progress)
  logoutUser,          // logout provider/user
  updateOrderStatus,   // update status order
  getPayments,         // ambil semua pembayaran
  confirmPayment,      // konfirmasi pembayaran
} from "../controllers/provider.js"; // pastikan path benar
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

// 🔹 Ambil semua order provider
router.get("/provider/orders", verifyToken, getOrders);

// 🔹 Konfirmasi order (ubah status jadi on_progress)
router.patch("/provider/orders/:uuid/confirm", verifyToken, confirmOrder);

// 🔹 Update status order manual (on_progress → finished)
router.patch("/provider/orders/:uuid/status", verifyToken, updateOrderStatus);

// 🔹 Ambil semua pembayaran untuk provider
router.get("/provider/payments", verifyToken, getPayments);

// 🔹 Konfirmasi pembayaran (ubah transaction_status jadi Success)
router.patch("/provider/payments/:paymentId/confirm", verifyToken, confirmPayment);

// 🔹 Logout provider
router.delete("/provider/logout", verifyToken, logoutUser);

export default router;
