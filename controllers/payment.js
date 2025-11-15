import Payment from "../models/paymentModel.js";
import Order from "../models/orderModel.js";

// ===============================
// CREATE PAYMENT
// ===============================
export const createPayment = async (req, res) => {
  try {
    const { orderId, amount, method } = req.body;

    // Ambil order berdasarkan ID
    const order = await Order.findByPk(orderId);

    if (!order) {
      return res.status(404).json({ error: "Order tidak ditemukan" });
    }

    // Create payment baru + copy data order
    const payment = await Payment.create({
      user_id: req.user.uuid,
      order_id: order.id,
      amount,
      method,
      transaction_status: "Pending",
      paid_at: null,

      order_name: order.name,
      vehicle_type: order.vehicle_type,
      vehicle_brand: order.vehicle_brand,
      vehicle_model: order.vehicle_model,
      license_plate: order.license_plate,
      color: order.color,
      order_status: order.status, // kalau kolomnya "status"
    });

    return res.status(201).json({
      message: "Payment berhasil dibuat",
      payment,
    });
  } catch (error) {
    console.error("❌ ERROR create payment:", error);
    return res.status(500).json({ error: "Gagal membuat payment" });
  }
};

// ===============================
// GET PAYMENT BY USER
// ===============================
export const getPaymentsByUser = async (req, res) => {
  try {
    const payments = await Payment.findAll({
      where: { user_id: req.user.uuid },
      order: [["created_at", "DESC"]],
    });

    return res.status(200).json({ payments });
  } catch (error) {
    console.error("❌ ERROR get payment by user:", error);
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
    console.error("❌ ERROR get payment:", error);
    return res.status(500).json({ error: "Gagal mengambil payment" });
  }
};

// ===============================
// UPDATE STATUS PAYMENT
// ===============================
export const updatePaymentStatus = async (req, res) => {
  try {
    const { status } = req.body;

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
    console.error("❌ ERROR update payment:", error);
    return res.status(500).json({ error: "Gagal mengupdate status payment" });
  }
};
