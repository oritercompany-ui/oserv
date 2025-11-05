import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

/**
 * Middleware untuk memeriksa role user
 * @param {string[]} allowedRoles - daftar role yang diizinkan
 */
export const verifyRole = (allowedRoles = []) => {
  return (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader)
        return res.status(401).json({ message: "Token tidak ditemukan" });

      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if (!allowedRoles.includes(decoded.role)) {
        return res.status(403).json({
          message: `Akses ditolak. Role '${decoded.role}' tidak diizinkan.`,
        });
      }

      req.user = decoded; // simpan user info ke req
      next();
    } catch (error) {
      res.status(403).json({ message: "Token tidak valid", error: error.message });
    }
  };
};
