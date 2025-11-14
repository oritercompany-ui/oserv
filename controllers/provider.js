import Order from "../models/orderModel.js";
import Payment from "../models/paymentModel.js";
import Auth from "../models/authModel.js";

// 🔹 Ambil semua order (admin / provider)
export const getOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      order: [["createdAt", "DESC"]],
    });
    res.status(200).json({ orders });
  } catch (error) {
    console.error("❌ getOrders error:", error);
    res.status(500).json({
      message: "Gagal mengambil orders",
      error: error.message,
    });
  }
};

// 🔹 Ambil order berdasarkan user login
export const getOrdersByUser = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId)
      return res.status(401).json({ message: "Token tidak valid" });

    const orders = await Order.findAll({
      where: { user_id: userId },
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json(orders);
  } catch (error) {
    console.error("❌ getOrdersByUser error:", error);
    res.status(500).json({
      message: "Gagal mengambil order user",
      error: error.message,
    });
  }
};

// 🔹 Konfirmasi order (ubah status ke in_progress)
export const confirmOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findByPk(id);
    if (!order)
      return res.status(404).json({ message: "Order tidak ditemukan" });

    order.status = "on_progress";
    await order.save();

    res.status(200).json({
      message: "Order berhasil dikonfirmasi",
      order,
    });
  } catch (error) {
    console.error("❌ confirmOrder error:", error);
    res.status(500).json({
      message: "Gagal konfirmasi order",
      error: error.message,
    });
  }
};

// 🔹 Update status order
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ["pending", "on_progress", "completed", "cancelled"];
    if (!validStatuses.includes(status))
      return res.status(400).json({ message: "Status tidak valid" });

    const order = await Order.findByPk(id);
    if (!order)
      return res.status(404).json({ message: "Order tidak ditemukan" });

    order.status = status;
    await order.save();

    res.status(200).json({
      message: `Status diubah ke '${status}'`,
      order,
    });
  } catch (error) {
    console.error("❌ updateOrderStatus error:", error);
    res.status(500).json({
      message: "Gagal update status order",
      error: error.message,
    });
  }
};

// 🔹 Ambil semua pembayaran
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
            "vehicle_model",
            "license_plate",
            "color",
            "status",
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({ payments });
  } catch (error) {
    console.error("❌ getPayments error:", error);
    res.status(500).json({
      message: "Gagal ambil data pembayaran",
      error: error.message,
    });
  }
};

// 🔹 Konfirmasi pembayaran
export const confirmPayment = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const payment = await Payment.findByPk(paymentId);
    if (!payment)
      return res.status(404).json({ message: "Pembayaran tidak ditemukan" });

    if (payment.transaction_status === "Success")
      return res
        .status(400)
        .json({ message: "Pembayaran sudah dikonfirmasi" });

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

// 🔹 Logout provider/user
export const logoutUser = async (req, res) => {
  try {
    res.status(200).json({ message: "Logout berhasil" });
  } catch (error) {
    console.error("logoutUser error:", error);
    res.status(500).json({
      message: "Gagal logout",
      error: error.message,
    });
  }
};
