import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// 🔐 Middleware untuk memverifikasi token JWT
export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Cek header Authorization
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Akses ditolak. Token tidak ditemukan." });
  }

  const token = authHeader.split(" ")[1];

  try {
    // Verifikasi token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Simpan data user ke request
    next(); // lanjut ke controller berikutnya
  } catch (error) {
    return res.status(403).json({ message: "Token tidak valid atau kedaluwarsa." });
  }
};
