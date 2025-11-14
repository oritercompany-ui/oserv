import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import {
  createOrder,
  getAllOrders,
  getOrderById,
  getOrdersByStatus,
  updateOrderStatus,
  deleteOrder,
} from "../controllers/ordercontroller.js";

const router = express.Router();

// =============================
// ORDER ROUTES
// =============================

// 1. Buat order (user)
router.post("/orders", verifyToken, createOrder);

// 2. Ambil semua order
router.get("/orders", verifyToken, getAllOrders);

// 3. Ambil order by ID
router.get("/orders/:orderId", verifyToken, getOrderById);

// 4. Ambil order berdasarkan status
router.get("/orders/status/:status", verifyToken, getOrdersByStatus);

// 5. Update status order
router.put("/orders/:orderId/status", verifyToken, updateOrderStatus);

// 6. Hapus order
router.delete("/orders/:orderId", verifyToken, deleteOrder);

export default router;
