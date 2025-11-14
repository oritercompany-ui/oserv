import Order from "../models/orderModel.js";

// ===============================
// 1. CREATE ORDER (user membuat order)
// ===============================
export const createOrder = async (req, res) => {
  try {
    const {
      phone_number,
      address,
      vehicle_type,
      vehicle_brand,
      vehicle_model,
      color,
      license_plate,
      service_type,
      problem_description,
    } = req.body;

    if (!req.user || !req.user.id) {
      return res.status(403).json({ message: "Token tidak valid atau kedaluwarsa." });
    }

    const order = await Order.create({
      user_id: req.user.id,
      name: req.user.username || "User",
      phone_number,
      address,
      vehicle_type,
      vehicle_brand,
      vehicle_model,
      color,
      license_plate,
      service_type,
      problem_description,
      status: "pending",
    });

    res.status(201).json({
      message: "Order berhasil dibuat",
      order,
    });
  } catch (err) {
    console.error("❌ Error create order:", err);
    res.status(500).json({
      message: "Gagal membuat order",
      error: err.message,
    });
  }
};

// ===============================
// 2. GET ALL ORDERS
// ===============================
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({ order: [["createdAt", "DESC"]] });
    res.json({
      message: "Berhasil mengambil semua order",
      data: orders,
    });
  } catch (err) {
    console.error("❌ Error getAllOrders:", err);
    res.status(500).json({
      message: "Gagal mengambil order",
      error: err.message,
    });
  }
};

// ===============================
// 3. GET ORDER BY ID
// ===============================
export const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findByPk(orderId);

    if (!order)
      return res.status(404).json({ message: "Order tidak ditemukan" });

    res.json({
      message: "Berhasil mengambil order",
      data: order,
    });
  } catch (err) {
    console.error("❌ Error getOrderById:", err);
    res.status(500).json({
      message: "Gagal mengambil order",
      error: err.message,
    });
  }
};

// ===============================
// 4. GET ORDERS BY STATUS
// ===============================
export const getOrdersByStatus = async (req, res) => {
  try {
    const { status } = req.params;
    const allowedStatus = ["pending", "accepted", "on_progress", "finished", "cancelled"];

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ message: "Status tidak valid" });
    }

    const orders = await Order.findAll({
      where: { status },
      order: [["createdAt", "DESC"]],
    });

    res.json({
      message: `Berhasil mengambil order dengan status ${status}`,
      data: orders,
    });
  } catch (err) {
    console.error("❌ Error getOrdersByStatus:", err);
    res.status(500).json({
      message: "Gagal mengambil order",
      error: err.message,
    });
  }
};

// ===============================
// 5. UPDATE STATUS ORDER
// ===============================
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const allowedStatus = ["pending", "accepted", "on_progress", "finished", "cancelled"];

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ message: "Status tidak valid" });
    }

    const order = await Order.findByPk(orderId);
    if (!order)
      return res.status(404).json({ message: "Order tidak ditemukan" });

    // jika provider menerima order, catat provider_id
    if (status === "accepted") {
      order.provider_id = req.user.id;
    }

    order.status = status;
    await order.save();

    res.json({
      message: `Status order diubah menjadi ${status}`,
      data: order,
    });
  } catch (err) {
    console.error("❌ Error updateOrderStatus:", err);
    res.status(500).json({
      message: "Gagal update status order",
      error: err.message,
    });
  }
};

// ===============================
// 6. DELETE ORDER
// ===============================
export const deleteOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findByPk(orderId);

    if (!order)
      return res.status(404).json({ message: "Order tidak ditemukan" });

    await order.destroy();

    res.json({
      message: "Order berhasil dihapus",
    });
  } catch (err) {
    console.error("❌ Error deleteOrder:", err);
    res.status(500).json({
      message: "Gagal menghapus order",
      error: err.message,
    });
  }
};
