import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import Auth from "../models/authModel.js";
import Role from "../models/roleModel.js";

dotenv.config();

/**
 * ===========================
 * REGISTER
 * ===========================
 */
export const register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "Semua field wajib diisi" });
    }

    const existingUser = await Auth.findOne({ where: { email } });
    if (existingUser)
      return res.status(400).json({ message: "Email sudah digunakan" });

    // 🔹 Tentukan role (default = "user")
    let roleName = "user";
    if (role === "provider") roleName = "provider";
    if (role === "admin") roleName = "admin";

    const userRole = await Role.findOne({ where: { name: roleName } });
    if (!userRole)
      return res
        .status(400)
        .json({ message: `Role '${roleName}' tidak ditemukan` });

    // 🔐 Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 💾 Simpan user baru
    const newUser = await Auth.create({
      username,
      email,
      password: hashedPassword,
      role_id: userRole.id,
    });

    // 🔑 Buat JWT token dengan role
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

/**
 * ===========================
 * LOGIN
 * ===========================
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await Auth.findOne({
      where: { email },
      include: {
        model: Role,
        as: "role", // harus sama dengan alias di model
        attributes: ["name"],
      },
    });

    if (!user)
      return res.status(404).json({ message: "User tidak ditemukan" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Password salah" });

    // 🔑 Buat token dengan role
    const token = jwt.sign(
      {
        uuid: user.uuid,
        email: user.email,
        role: user.role.name,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // 🔀 Tentukan redirect sesuai role
    let redirectTo = "";
    if (user.role.name === "admin") redirectTo = "/admin/dashboard";
    else if (user.role.name === "provider") redirectTo = "/provider/home";
    else redirectTo = "/user/home";

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

/**
 * ===========================
 * PROFILE / TOKEN VALIDATION
 * ===========================
 */
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

    if (!user)
      return res.status(404).json({ message: "User tidak ditemukan" });

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

/**
 * ===========================
 * GET SEMUA USER
 * ===========================
 */
export const getAllAuth = async (req, res) => {
  try {
    const users = await Auth.findAll({
      include: { model: Role, as: "role", attributes: ["name"] },
      attributes: ["uuid", "username", "email"],
    });

    const formatted = users.map((u) => ({
      uuid: u.uuid,
      username: u.username,
      email: u.email,
      role: u.role?.name,
    }));

    res.status(200).json(formatted);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Gagal ambil data user", error: error.message });
  }
};

/**
 * ===========================
 * GET USER BY UUID
 * ===========================
 */
export const getAuthById = async (req, res) => {
  try {
    const { uuid } = req.params;
    const user = await Auth.findOne({
      where: { uuid },
      include: { model: Role, as: "role", attributes: ["name"] },
      attributes: ["uuid", "username", "email"],
    });

    if (!user)
      return res.status(404).json({ message: "User tidak ditemukan" });

    res.status(200).json({
      uuid: user.uuid,
      username: user.username,
      email: user.email,
      role: user.role?.name,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Gagal mengambil data user", error: error.message });
  }
};

/**
 * ===========================
 * DELETE USER (ADMIN ONLY)
 * ===========================
 */
export const deleteAuthById = async (req, res) => {
  try {
    const { uuid } = req.params;
    const user = await Auth.findOne({ where: { uuid } });
    if (!user)
      return res.status(404).json({ message: "User tidak ditemukan" });

    await Auth.destroy({ where: { uuid } });
    res.status(200).json({ message: `User dengan uuid ${uuid} berhasil dihapus` });
  } catch (error) {
    res.status(500).json({ message: "Gagal menghapus user", error: error.message });
  }
};

/**
 * ===========================
 * LOGOUT
 * ===========================
 */
export const logout = async (req, res) => {
  try {
    res.status(200).json({ message: "Logout berhasil. Hapus token di client." });
  } catch (error) {
    res.status(500).json({ message: "Gagal logout", error: error.message });
  }
};
