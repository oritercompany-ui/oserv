import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import Auth from "../models/authModel.js";
import Role from "../models/roleModel.js";

dotenv.config();

// ===========================
// REGISTER
// ===========================
export const register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "Semua field wajib diisi" });
    }

    const existingUser = await Auth.findOne({ where: { email } });
    if (existingUser)
      return res.status(400).json({ message: "Email sudah digunakan" });

    // Tentukan role default
    let roleName = "user";
    if (role === "provider") roleName = "provider";
    if (role === "admin") roleName = "admin";

    const userRole = await Role.findOne({ where: { name: roleName } });
    if (!userRole)
      return res
        .status(400)
        .json({ message: `Role '${roleName}' tidak ditemukan` });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await Auth.create({
      username,
      email,
      password: hashedPassword,
      role_id: userRole.id,
    });

    const token = jwt.sign(
      {
        uuid: newUser.uuid,
        email: newUser.email,
        role: userRole.name,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(201).json({
      message: "Registrasi berhasil",
      user: {
        uuid: newUser.uuid,
        username: newUser.username,
        email: newUser.email,
        role: userRole.name,
      },
      token,
    });
  } catch (error) {
    console.error("❌ Register error:", error);
    res.status(500).json({ message: "Gagal register", error: error.message });
  }
};

// ===========================
// LOGIN
// ===========================
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await Auth.findOne({
      where: { email },
      include: {
        model: Role,
        as: "role",
        attributes: ["name"],
      },
    });

    if (!user) return res.status(404).json({ message: "User tidak ditemukan" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Password salah" });

    const token = jwt.sign(
      {
        uuid: user.uuid,
        email: user.email,
        role: user.role.name,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    let redirectTo = "/user/home";
    if (user.role.name === "admin") redirectTo = "/admin/dashboard";
    if (user.role.name === "provider") redirectTo = "/provider/home";

    return res.status(200).json({
      message: "Login berhasil",
      user: {
        uuid: user.uuid,
        username: user.username,
        email: user.email,
        role: user.role.name,
      },
      token,
      redirectTo,
    });
  } catch (error) {
    console.error("❌ Login error:", error);
    res.status(500).json({ message: "Gagal login", error: error.message });
  }
};

// ===========================
// PROFILE / TOKEN VALIDATION
// ===========================
export const profile = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader)
      return res.status(401).json({ message: "Token tidak ada" });

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await Auth.findOne({
      where: { uuid: decoded.uuid },
      include: { model: Role, as: "role", attributes: ["name"] },
      attributes: ["uuid", "username", "email"],
    });

    if (!user) return res.status(404).json({ message: "User tidak ditemukan" });

    res.status(200).json({
      message: "Token valid",
      user: {
        uuid: user.uuid,
        username: user.username,
        email: user.email,
        role: user.role.name,
      },
    });
  } catch (error) {
    res
      .status(401)
      .json({ message: "Token tidak valid", error: error.message });
  }
};

// ===========================
// LOGOUT
// ===========================
export const logout = async (req, res) => {
  try {
    // Cukup beri respon, client hapus token sendiri
    res.status(200).json({ message: "Logout berhasil" });
  } catch (error) {
    res.status(500).json({ message: "Gagal logout", error: error.message });
  }
};
