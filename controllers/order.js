import Auth from "../models/authModel.js";
import Order from "../models/orderModel.js";

// 🔹 Buat order baru
export const createOrder = async (req, res) => {
  try {
    // Ambil uuid & role user dari middleware verifyToken
    const userUuid = req.user?.uuid;
    const userRole = req.user?.role; // pastikan middleware menambahkan role

    if (!userUuid) {
      return res.status(401).json({ message: "Token tidak valid" });
    }

    if (userRole !== "user") {
      return res.status(403).json({ message: "Hanya user biasa yang bisa membuat order" });
    }

    // Cari user di database
    const user = await Auth.findOne({ where: { uuid: userUuid } });
    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    const {
      phone_number,
      vehicle_type,
      vehicle_brand,
      problem_description,
      service_type,
      address,
    } = req.body;

    // Validasi input
    if (!phone_number || !vehicle_type || !vehicle_brand || !problem_description || !service_type || !address) {
      return res.status(400).json({ message: "Semua field wajib diisi" });
    }

    // Buat order baru
    const newOrder = await Order.create({
      user_id: user.uuid,
      name: req.body.name || user.username,
      phone_number,
      vehicle_type,
      vehicle_brand,
      problem_description,
      service_type,
      address,
      status: "pending",
    });

    res.status(201).json({
      message: "Order berhasil dibuat",
      order: newOrder,
    });
  } catch (error) {
    console.error("❌ createOrder error:", error);
    res.status(500).json({ message: "Gagal membuat order", error: error.message });
  }
};

// 🔹 Ambil semua order user
export const getOrdersByUser = async (req, res) => {
  try {
    const userUuid = req.user?.uuid;
    if (!userUuid) {
      return res.status(401).json({ message: "Token tidak valid" });
    }

    const orders = await Order.findAll({
      where: { user_id: userUuid },
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({ orders });
  } catch (error) {
    console.error("❌ getOrdersByUser error:", error);
    res.status(500).json({ message: "Gagal ambil order", error: error.message });
  }
};
