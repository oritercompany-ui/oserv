import express from "express";
import {
  register,
  login,
  profile,
  getAllAuth,
  getAuthById,
  deleteAuthById,
  logout,
} from "../controllers/auth.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { verifyRole } from "../middleware/verifyRole.js";

const router = express.Router();

// ====================
// 🔓 PUBLIC ROUTES
// ====================
router.post("/register", register);
router.post("/login", login);
router.delete("/logout", logout);

// ====================
// 🔒 PROTECTED ROUTES
// ====================

// Siapa pun yang punya token valid bisa akses profil
router.get("/profile", verifyToken, profile);

// ====================
// 👨‍🔧 PROVIDER & ADMIN ROUTES
// ====================

// Provider & admin bisa lihat semua user
router.get("/users", verifyToken, verifyRole(["provider", "admin"]), getAllAuth);

// Provider & admin bisa lihat user tertentu
router.get("/users/:uuid", verifyToken, verifyRole(["provider", "admin"]), getAuthById);

// Hanya admin yang bisa hapus user
router.delete("/users/:uuid", verifyToken, verifyRole(["admin"]), deleteAuthById);

export default router;
