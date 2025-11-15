import Payment from "../models/paymentModel.js";
import Order from "../models/orderModel.js";

export const createPayment = async (req, res) => {
  try {
    const { orderId, amount, method } = req.body;
    const userId = req.user.id;

    // 1️⃣ Ambil data order
    const order = await Order.findByPk(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order tidak ditemukan" });
    }

    // 2️⃣ Create payment + copy data order
    const payment = await Payment.create({
      order_id: order.id,
      user_id: userId,
      mechanic_id: order.provider_id,
      amount,
      method,
      transaction_status: "pending",
      paid_at: null,

      // COPY ORDER → PAYMENT
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
    console.error("❌ Error create payment:", error);
    return res.status(500).json({ message: "Gagal membuat payment" });
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
