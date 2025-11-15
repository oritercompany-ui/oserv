import Payment from "../models/paymentModel.js";
import Order from "../models/orderModel.js";


// ======================================================
// CREATE PAYMENT (USER)
// ======================================================
export const createPayment = async (req, res) => {
  try {
    const {
      order_id,
      user_id,
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

    const payment = await Payment.create({
      order_id,
      user_id,
      amount,
      method,
      order_name,
      vehicle_type,
      vehicle_brand,
      vehicle_model,
      license_plate,
      color,
      order_status,
      transaction_status: "pending",
    });

    res.status(201).json({ message: "Payment created", payment });
  } catch (error) {
    console.error("❌ Error create payment:", error);
    res.status(500).json({ error: "Gagal membuat payment" });
  }
};


// ======================================================
// GET ALL PAYMENTS (USER)
// ======================================================
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


// ======================================================
// GET PAYMENT BY ID (USER)
// ======================================================
export const getPaymentById = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.uuid;

    const payment = await Payment.findOne({
      where: { uuid: id, user_id },
    });

    if (!payment) {
      return res.status(404).json({ message: "Pembayaran tidak ditemukan" });
    }

    res.status(200).json({ payment });
  } catch (error) {
    console.error("❌ getPaymentById error:", error);
    res.status(500).json({
      message: "Gagal mengambil detail pembayaran",
      error: error.message,
    });
  }
};


// ======================================================
// UPDATE PAYMENT STATUS (USER)
// ======================================================
export const updatePaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { transaction_status } = req.body;

    const validStatuses = ["pending", "Success", "failed", "Cancelled"];
    if (!validStatuses.includes(transaction_status)) {
      return res.status(400).json({ message: "Status tidak valid" });
    }

    const payment = await Payment.findOne({ where: { uuid: id } });
    if (!payment) {
      return res.status(404).json({ message: "Pembayaran tidak ditemukan" });
    }

    await payment.update({
      transaction_status,
      paid_at:
        transaction_status === "Success"
          ? new Date()
          : payment.paid_at,
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


// ======================================================
// DELETE PAYMENT (USER)
// ======================================================
export const deletePayment = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.uuid;

    const payment = await Payment.findOne({
      where: { uuid: id, user_id },
    });

    if (!payment) {
      return res.status(404).json({ message: "Pembayaran tidak ditemukan" });
    }

    await payment.destroy();

    res.status(200).json({
      message: "Pembayaran berhasil dihapus",
    });
  } catch (error) {
    console.error("❌ deletePayment error:", error);
    res.status(500).json({
      message: "Gagal menghapus pembayaran",
      error: error.message,
    });
  }
};
