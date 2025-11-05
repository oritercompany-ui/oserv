import Order from "../models/OrderModel.js";
import Payment from "../models/paymentModel.js";

// 🔹 Ambil semua order (semua status)
export const getOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({ orders });
  } catch (error) {
    console.error("❌ getOrders error:", error);
    res.status(500).json({ message: "Gagal ambil order", error: error.message });
  }
};

// 🔹 Konfirmasi order oleh provider
export const confirmOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findByPk(orderId);
    if (!order)
      return res.status(404).json({ message: "Order tidak ditemukan" });

    order.status = "in_progress";
    await order.save();

    res.status(200).json({ message: "Order berhasil dikonfirmasi", order });
  } catch (error) {
    console.error("❌ confirmOrder error:", error);
    res.status(500).json({ message: "Gagal konfirmasi order", error: error.message });
  }
};

// 🔹 Update status manual
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const validStatuses = ["pending", "in_progress", "completed", "cancelled"];
    if (!validStatuses.includes(status))
      return res.status(400).json({ message: "Status tidak valid" });

    const order = await Order.findByPk(orderId);
    if (!order)
      return res.status(404).json({ message: "Order tidak ditemukan" });

    order.status = status;
    await order.save();

    res.status(200).json({ message: `Status diubah ke '${status}'`, order });
  } catch (error) {
    console.error("❌ updateOrderStatus error:", error);
    res.status(500).json({ message: "Gagal update status", error: error.message });
  }
};

// 🔹 Ambil semua pembayaran untuk provider
export const getPayments = async (req, res) => {
  try {
    const payments = await Payment.findAll({
      include: [
        {
          model: Order,
          as: "order",
          attributes: [
            "id",
            "name",
            "phone_number",
            "vehicle_type",
            "vehicle_brand",
            "status",
          ],
        },
      ],
      order: [["created_at", "DESC"]],
    });

    res.status(200).json({ payments });
  } catch (error) {
    console.error("❌ getPayments error:", error);
    res.status(500).json({ message: "Gagal ambil data pembayaran", error: error.message });
  }
};

// 🔹 Konfirmasi pembayaran (update transaction_status jadi 'Success')
export const confirmPayment = async (req, res) => {
  try {
    const { paymentId } = req.params;

    const payment = await Payment.findByPk(paymentId);
    if (!payment)
      return res.status(404).json({ message: "Pembayaran tidak ditemukan" });

    if (payment.transaction_status === "Success")
      return res.status(400).json({ message: "Pembayaran sudah dikonfirmasi" });

    // Update status pembayaran
    payment.transaction_status = "Success";
    payment.paid_at = new Date();
    await payment.save();

    res.status(200).json({
      message: "Pembayaran berhasil dikonfirmasi ✅",
      payment,
    });
  } catch (error) {
    console.error("❌ confirmPayment error:", error);
    res.status(500).json({ message: "Gagal konfirmasi pembayaran", error: error.message });
  }
};

// 🔹 Logout provider
export const logoutProvider = async (req, res) => {
  try {
    res.status(200).json({ message: "Logout berhasil" });
  } catch (error) {
    console.error("logoutProvider error:", error);
    res.status(500).json({ message: "Gagal logout", error: error.message });
  }
};
