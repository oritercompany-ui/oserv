import Order from "../models/orderModel.js";

// ===============================
// CREATE ORDER (AMAN & LENGKAP)
// ===============================
export const createOrder = async (req, res) => {
  try {
    // ✅ Pastikan user dari token ada
    if (!req.user?.id) {
      return res.status(401).json({ message: "User tidak ditemukan. Pastikan token dikirim." });
    }

    const {
      name,
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

    // ✅ Validasi minimal field wajib
    if (!name || !phone_number || !address || !vehicle_type || !service_type) {
      return res.status(400).json({
        message: "Field name, phone_number, address, vehicle_type, dan service_type wajib diisi",
      });
    }

    // ✅ Buat order dengan fallback/default value
    const order = await Order.create({
      user_id: req.user.id,
      name,
      phone_number,
      address,
      vehicle_type,
      vehicle_brand: vehicle_brand || "Unknown",
      vehicle_model: vehicle_model || "Unknown",
      color: color || "Unknown",
      license_plate: license_plate || "N/A",
      service_type,
      problem_description: problem_description || "-",
      status: "pending",
    });

    res.status(201).json({
      message: "Order berhasil dibuat",
      data: order,
    });
  } catch (err) {
    console.log("❌ Error create order:", err);
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
    res.json({ message: "Berhasil mengambil semua order", data: orders });
  } catch (err) {
    console.log("❌ Error getAllOrders:", err);
    res.status(500).json({ message: "Gagal mengambil order", error: err.message });
  }
};

// ===============================
// 3. GET ORDER BY ID
// ===============================
export const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findByPk(orderId);
    if (!order) return res.status(404).json({ message: "Order tidak ditemukan" });

    res.json({ message: "Berhasil mengambil order", data: order });
  } catch (err) {
    console.log("❌ Error getOrderById:", err);
    res.status(500).json({ message: "Gagal mengambil order", error: err.message });
  }
};

// ===============================
// 4. GET ORDERS BY STATUS
// ===============================
export const getOrdersByStatus = async (req, res) => {
  try {
    const { status } = req.params;
    const allowedStatus = ["pending","accepted","on_progress","finished","cancelled"];
    if (!allowedStatus.includes(status)) return res.status(400).json({ message: "Status tidak valid" });

    const orders = await Order.findAll({ where: { status }, order: [["createdAt", "DESC"]] });
    res.json({ message: `Berhasil mengambil order dengan status ${status}`, data: orders });
  } catch (err) {
    console.log("❌ Error getOrdersByStatus:", err);
    res.status(500).json({ message: "Gagal mengambil order", error: err.message });
  }
};

// ===============================
// 5. UPDATE STATUS ORDER
// ===============================
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const allowedStatus = ["pending","accepted","on_progress","finished","cancelled"];
    if (!allowedStatus.includes(status)) return res.status(400).json({ message: "Status tidak valid" });

    const order = await Order.findByPk(orderId);
    if (!order) return res.status(404).json({ message: "Order tidak ditemukan" });

    if (status === "accepted") order.provider_id = req.user.id; // provider dari token
    order.status = status;

    await order.save();
    res.json({ message: `Status order diubah menjadi ${status}`, data: order });
  } catch (err) {
    console.log("❌ Error updateOrderStatus:", err);
    res.status(500).json({ message: "Gagal update status order", error: err.message });
  }
};

// ===============================
// 6. DELETE ORDER
// ===============================
export const deleteOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findByPk(orderId);
    if (!order) return res.status(404).json({ message: "Order tidak ditemukan" });

    await order.destroy();
    res.json({ message: "Order berhasil dihapus" });
  } catch (err) {
    console.log("❌ Error deleteOrder:", err);
    res.status(500).json({ message: "Gagal menghapus order", error: err.message });
  }
};
