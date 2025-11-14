import Payment from "../models/paymentModel.js";

// =====================
// CREATE PAYMENT (USER)
// =====================
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

    if (
      !order_id ||
      !amount ||
      !method ||
      !order_name ||
      !vehicle_type ||
      !vehicle_brand
    ) {
      return res.status(400).json({ message: "Semua field wajib diisi" });
    }

    const user_id = req.user.uuid;

    const payment = await Payment.create({
      order_id,
      user_id,
      amount,
      method,
      transaction_status: "pending",
      order_name,
      vehicle_type,
      vehicle_brand,
      vehicle_model: vehicle_model || "-",
      license_plate: license_plate || "-",
      color: color || "-",
      order_status: order_status || "pending",
    });

    res.status(201).json({ message: "Pembayaran berhasil dibuat", payment });
  } catch (error) {
    console.error("❌ createPayment error:", error);
    res.status(500).json({
      message: "Gagal membuat pembayaran",
      error: error.message,
    });
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
export const getPaymentsProvider = async (req, res) => {
  try {
    const payments = await Payment.findAll({
      order: [["created_at", "DESC"]],
    });

    const formatted = payments.map((p) => ({
      id: p.uuid,
      amount: p.amount || 0,
      method: p.method || "-",
      transaction_status: p.transaction_status || "pending",
      created_at: p.created_at,
      order: {
        name: p.order_name || "Order Tanpa Nama",
        vehicle_type: p.vehicle_type || "-",
        vehicle_brand: p.vehicle_brand || "-",
        vehicle_model: p.vehicle_model || "-",
        license_plate: p.license_plate || "-",
        color: p.color || "-",
      },
      order_status: p.order_status || "pending",
    }));

    res.status(200).json({ payments: formatted });
  } catch (error) {
    console.error("❌ getPaymentsProvider error:", error);
    res.status(500).json({
      message: "Gagal ambil data pembayaran",
      error: error.message,
    });
  }
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
