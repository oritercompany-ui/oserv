import express from "express";
import {
  register,
  login,
  profile,
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
router.post("/logout", logout); // ganti ke POST agar lebih konsisten

// ====================
// 🔒 PROTECTED ROUTES
// ====================

// Semua user yang tokennya valid bisa akses profil
router.get("/profile", verifyToken, profile);

export default router;
