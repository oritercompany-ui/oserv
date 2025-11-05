import express from "express";
import {
  createOrder,
  getOrdersByUser
} from "../controllers/order.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

// POST /orders → buat order baru
router.post("/orders", verifyToken, createOrder);

// GET /orders → semua order
//router.get('/orders', verifyToken, getAllOrders);

// GET /orders/user/:user_id → order by user
router.get("/orders", verifyToken, getOrdersByUser); // GET /orders → order milik user

// PATCH /orders/:id/status → update status
//router.patch("/:id/status", updateOrderStatus);

// DELETE /orders/:id → hapus order
//router.delete("/:id", deleteOrder);

export default router;
