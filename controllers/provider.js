import Order from "../models/orderModel.js";
import Payment from "../models/paymentModel.js";

// =======================================
// GET ALL ORDERS (Admin / Provider)
// =======================================
export const getOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({ orders });
  } catch (error) {
    console.error("❌ getOrders error:", error);
    return res.status(500).json({
      message: "Gagal mengambil orders",
      error: error.message,
    });
  }
};

// =======================================
// GET ORDERS BY USER LOGIN
// =======================================
export const getOrdersByUser = async (req, res) => {
  try {
    const userUuid = req.user?.uuid;
    if (!userUuid) return res.status(401).json({ message: "Token tidak valid" });

    const orders = await Order.findAll({
      where: { user_id: userUuid },
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({ orders });
  } catch (error) {
    console.error("❌ getOrdersByUser error:", error);
    return res.status(500).json({
      message: "Gagal mengambil order user",
      error: error.message,
    });
  }
};

// =======================================
// GET ORDERS BY PROVIDER LOGIN
// =======================================
export const getOrdersByProvider = async (req, res) => {
  try {
    const providerUuid = req.user?.uuid;
    if (!providerUuid) return res.status(401).json({ message: "Token tidak valid" });

    const orders = await Order.findAll({
      where: { provider_id: providerUuid },
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({ orders });
  } catch (error) {
    console.error("❌ getOrdersByProvider error:", error);
    return res.status(500).json({
      message: "Gagal mengambil order provider",
      error: error.message,
    });
  }
};

// =======================================
// CONFIRM ORDER (Provider Takes Order)
// =======================================
export const confirmOrder = async (req, res) => {
  try {
    const { uuid } = req.params;

    const order = await Order.findOne({ where: { uuid } });
    if (!order)
      return res.status(404).json({ message: "Order tidak ditemukan" });

    order.status = "on_progress";

    // auto set provider
    if (!order.provider_id) {
      order.provider_id = req.user.uuid;
    }

    await order.save();

    return res.status(200).json({
      message: "Order berhasil dikonfirmasi",
      order,
    });
  } catch (error) {
    console.error("❌ confirmOrder error:", error);
    return res.status(500).json({
      message: "Gagal konfirmasi order",
      error: error.message,
    });
  }
};

// =======================================
// UPDATE ORDER STATUS
// =======================================
export const updateOrderStatus = async (req, res) => {
  try {
    const { uuid } = req.params;
    const { status } = req.body;

    const validStatuses = [
      "pending",
      "accepted",
      "on_progress",
      "finished",
      "cancelled",
    ];

    if (!validStatuses.includes(status))
      return res.status(400).json({ message: "Status tidak valid" });

    const order = await Order.findOne({ where: { uuid } });
    if (!order)
      return res.status(404).json({ message: "Order tidak ditemukan" });

    order.status = status;

    // auto assign provider jika accepted
    if (status === "accepted" && !order.provider_id) {
      order.provider_id = req.user.uuid;
    }

    await order.save();

    return res.status(200).json({
      message: `Status diubah ke '${status}'`,
      order,
    });
  } catch (error) {
    console.error("❌ updateOrderStatus error:", error);
    return res.status(500).json({
      message: "Gagal update status order",
      error: error.message,
    });
  }
};

// =======================================
// GET ALL PAYMENTS (Provider / Admin)
// TANPA RELASI — pakai data copy di Payments
// =======================================
export const getPayments = async (req, res) => {
  try {
    const providerUuid = req.user?.uuid;

    const payments = await Payment.findAll({
      where: { mechanic_id: providerUuid }, // hanya payment untuk provider ini
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({ payments });
  } catch (error) {
    console.error("❌ getPayments error:", error);
    return res.status(500).json({
      message: "Gagal ambil data pembayaran",
      error: error.message,
    });
  }
};

// =======================================
// CONFIRM PAYMENT
// =======================================
export const confirmPayment = async (req, res) => {
  try {
    const { paymentId } = req.params;

    const payment = await Payment.findOne({
      where: { uuid: paymentId },
    });

    if (!payment)
      return res.status(404).json({ message: "Pembayaran tidak ditemukan" });

    if (payment.transaction_status === "Success")
      return res
        .status(400)
        .json({ message: "Pembayaran sudah dikonfirmasi" });

    payment.transaction_status = "Success";
    payment.paid_at = new Date();

    await payment.save();

    return res.status(200).json({
      message: "Pembayaran berhasil dikonfirmasi",
      payment,
    });
  } catch (error) {
    console.error("❌ confirmPayment error:", error);
    return res.status(500).json({
      message: "Gagal konfirmasi pembayaran",
      error: error.message,
    });
  }
};

// =======================================
// LOGOUT USER
// =======================================
export const logoutUser = async (req, res) => {
  try {
    return res.status(200).json({ message: "Logout berhasil" });
  } catch (error) {
    console.error("logoutUser error:", error);
    return res.status(500).json({
      message: "Gagal logout",
      error: error.message,
    });
  }
};
