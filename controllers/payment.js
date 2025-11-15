import Payment from "../models/paymentModel.js";
import Order from "../models/orderModel.js";

// ===============================
// CREATE PAYMENT
// ===============================
export const createPayment = async (req, res) => {
  try {
    const { orderId, amount, method } = req.body;

    // ambil user id dari token
    const userId = req.user?.uuid || req.user?.id || req.userId;

    if (!userId) {
      return res.status(400).json({ message: "User tidak terautentikasi" });
    }

    // validasi input
    if (!orderId || !amount || !method) {
      return res.status(400).json({ message: "Semua field wajib diisi" });
    }

    // cek order
    const order = await Order.findByPk(orderId);
    if (!order) {
      return res.status(404).json({ error: "Order tidak ditemukan" });
    }

    // create payment
    const payment = await Payment.create({
      user_id: userId,
      order_id: order.id,
      mechanic_id: order.mechanic_id || null,

      amount,
      method,
      transaction_status: "Pending",
      paid_at: null,

      // copy data order
      order_name: order.name,
      vehicle_type: order.vehicle_type,
      vehicle_brand: order.vehicle_brand,
      vehicle_model: order.vehicle_model,
      license_plate: order.license_plate,
      color: order.color,
      order_status: order.status,
    });

    return res.status(201).json({
      message: "Payment berhasil dibuat",
      payment,
    });
  } catch (error) {
    console.error("❌ ERROR createPayment:", error);
    return res.status(500).json({
      error: "Gagal membuat payment",
    });
  }
};

// ===============================
// GET PAYMENT BY USER
// ===============================
export const getPaymentsByUser = async (req, res) => {
  try {
    const payments = await Payment.findAll({
      where: { user_id: req.user.uuid },
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({ payments });
  } catch (error) {
    console.error("❌ ERROR getPaymentsByUser:", error);
    return res.status(500).json({ error: "Gagal mengambil data payment" });
  }
};

// ===============================
// GET PAYMENT BY ID
// ===============================
export const getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findByPk(req.params.id);

    if (!payment) {
      return res.status(404).json({ error: "Payment tidak ditemukan" });
    }

    return res.status(200).json({ payment });
  } catch (error) {
    console.error("❌ ERROR getPaymentById:", error);
    return res.status(500).json({ error: "Gagal mengambil payment" });
  }
};

// ===============================
// UPDATE STATUS PAYMENT
// ===============================
export const updatePaymentStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: "Status wajib diisi" });
    }

    const payment = await Payment.findByPk(req.params.id);

    if (!payment) {
      return res.status(404).json({ error: "Payment tidak ditemukan" });
    }

    payment.transaction_status = status;
    payment.paid_at = status === "Success" ? new Date() : null;

    await payment.save();

    return res.status(200).json({
      message: "Status payment berhasil diperbarui",
      payment,
    });
  } catch (error) {
    console.error("❌ ERROR updatePaymentStatus:", error);
    return res.status(500).json({ error: "Gagal mengupdate status payment" });
  }
};
