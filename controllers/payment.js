import Payment from "../models/paymentModel.js";
import Order from "../models/orderModel.js";

// =====================
// CREATE PAYMENT (USER)
// =====================

// ✅ Create Payment (user)
export const createPayment = async (req, res) => {
  try {
    const {
      order_id,
      amount,
      method,
      order_name,
      vehicle_type,
      vehicle_brand,
      vehicle_model,
      license_plate,
      color,
      order_status,
    } = req.body;

    if (!order_id || !amount || !method || !order_name || !vehicle_type || !vehicle_brand) {
      return res.status(400).json({ message: "Semua field wajib diisi" });
    }

    const user_id = req.user.uuid;

    // Mapping status frontend ke enum backend
    const validStatuses = ["pending", "Success", "failed", "Cancelled"];
    let statusMapped = "pending"; // default
    if (order_status) {
      if (["finished", "completed"].includes(order_status.toLowerCase())) {
        statusMapped = "Success";
      } else if (validStatuses.includes(order_status)) {
        statusMapped = order_status;
      }
    }

    const payment = await Payment.create({
      order_id,
      user_id,
      amount,
      method,
      transaction_status: "pending",
      order_name,
      vehicle_type,
      vehicle_brand,
      vehicle_model,
      license_plate,
      color,
      order_status: statusMapped,
    });

    res.status(201).json({ message: "Pembayaran berhasil dibuat", payment });
  } catch (error) {
    console.error("❌ createPayment error:", error);
    res.status(500).json({ message: "Gagal membuat pembayaran", error: error.message });
  }
};


// =====================
// GET ALL PAYMENTS (USER)
// =====================
export const getAllPayments = async (req, res) => {
  try {
    const user_id = req.user.uuid;
    const payments = await Payment.findAll({
      where: { user_id },
      order: [["created_at", "DESC"]],
    });
    res.status(200).json({ payments });
  } catch (error) {
    console.error("❌ getAllPayments error:", error);
    res.status(500).json({
      message: "Gagal mengambil data pembayaran",
      error: error.message,
    });
  }
};

// =====================
// GET PAYMENT BY ID (USER)
// =====================
export const getPaymentById = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.uuid;

    const payment = await Payment.findOne({ where: { uuid: id, user_id } });
    if (!payment)
      return res.status(404).json({ message: "Pembayaran tidak ditemukan" });

    res.status(200).json({ payment });
  } catch (error) {
    console.error("❌ getPaymentById error:", error);
    res.status(500).json({
      message: "Gagal mengambil detail pembayaran",
      error: error.message,
    });
  }
};

// =====================
// UPDATE PAYMENT STATUS (USER)
// =====================
export const updatePaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { transaction_status } = req.body;
    const validStatuses = ["pending", "Success", "failed", "Cancelled"];
    if (!validStatuses.includes(transaction_status)) {
      return res.status(400).json({ message: "Status tidak valid" });
    }

    const payment = await Payment.findOne({ where: { uuid: id } });
    if (!payment)
      return res.status(404).json({ message: "Pembayaran tidak ditemukan" });

    await payment.update({
      transaction_status,
      paid_at: transaction_status === "Success" ? new Date() : payment.paid_at,
    });

    res.status(200).json({
      message: `Status pembayaran diubah ke '${transaction_status}'`,
      payment,
    });
  } catch (error) {
    console.error("❌ updatePaymentStatus error:", error);
    res.status(500).json({
      message: "Gagal memperbarui status pembayaran",
      error: error.message,
    });
  }
};

// =====================
// DELETE PAYMENT (USER)
// =====================
export const deletePayment = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.uuid;

    const payment = await Payment.findOne({ where: { uuid: id, user_id } });
    if (!payment)
      return res.status(404).json({ message: "Pembayaran tidak ditemukan" });

    await payment.destroy();
    res.status(200).json({ message: "Pembayaran berhasil dihapus" });
  } catch (error) {
    console.error("❌ deletePayment error:", error);
    res.status(500).json({
      message: "Gagal menghapus pembayaran",
      error: error.message,
    });
  }
};

// =====================
// GET ALL PAYMENTS (PROVIDER)
// =====================
// GET ALL ORDERS SEBAGAI "PAYMENTS" UNTUK PROVIDER
export const getOrdersAsPayments = async (req, res) => {
  const orders = await Order.findAll({ order: [["createdAt", "DESC"]] });
  const formatted = orders.map(o => ({
    id: o.id,
    amount: o.estimated_price || 0,
    method: "-", // karena order belum bayar
    transaction_status: "pending",
    created_at: o.createdAt,
    order: {
      name: o.name || "Order Tanpa Nama",
      vehicle_type: o.vehicle_type || "-",
      vehicle_brand: o.vehicle_brand || "-",
      vehicle_model: o.vehicle_model || "-",
      license_plate: o.license_plate || "-",
      color: o.color || "-",
    },
    order_status: o.status || "pending",
  }));
  res.status(200).json({ payments: formatted });
};
// =====================
// CONFIRM PAYMENT (PROVIDER)
// =====================
export const confirmPayment = async (req, res) => {
  try {
    const { paymentId } = req.params;

    const payment = await Payment.findOne({ where: { uuid: paymentId } });
    if (!payment)
      return res.status(404).json({ message: "Pembayaran tidak ditemukan" });

    if (payment.transaction_status === "Success")
      return res.status(400).json({ message: "Pembayaran sudah dikonfirmasi" });

    payment.transaction_status = "Success";
    payment.paid_at = new Date();
    await payment.save();

    res.status(200).json({
      message: "Pembayaran berhasil dikonfirmasi ✅",
      payment,
    });
  } catch (error) {
    console.error("❌ confirmPayment error:", error);
    res.status(500).json({
      message: "Gagal konfirmasi pembayaran",
      error: error.message,
    });
  }
};
