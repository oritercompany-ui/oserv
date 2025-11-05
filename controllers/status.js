import db from "../config/db.js"; // koneksi MySQL, pakai mysql2 atau sequelize

// GET /api/orders → ambil semua order user
export const getOrders = async (req, res) => {
  try {
    const userId = req.user.id; // asumsi pakai middleware auth, user ID tersedia
    const [rows] = await db.execute(
      "SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC",
      [userId]
    );
    res.json({ orders: rows });
  } catch (error) {
    console.error("❌ Gagal fetch orders:", error);
    res.status(500).json({ message: "Gagal fetch orders" });
  }
};

// PATCH /api/orders/:id/confirm → confirm order
export const status = async (req, res) => {
  try {
    const orderId = req.params.id;

    // Validasi id
    if (!orderId) {
      return res.status(400).json({ message: "ID order wajib dikirim" });
    }

    // Update status ke 'confirmed'
    const [result] = await db.execute(
      "UPDATE orders SET status = 'confirmed' WHERE id = ?",
      [orderId]
    );

    // Cek apakah ada row yang diupdate
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Order tidak ditemukan" });
    }

    // Ambil order terbaru untuk dikirim ke frontend
    const [rows] = await db.execute("SELECT * FROM orders WHERE id = ?", [orderId]);
    const updatedOrder = rows[0];

    // Kirim response
    res.status(200).json({
      message: "Order berhasil dikonfirmasi",
      status: updatedOrder.status, // kirim status baru juga biar frontend tahu
      order: updatedOrder,
    });
  } catch (error) {
    console.error("❌ Confirm order gagal:", error);
    res.status(500).json({ message: "Gagal konfirmasi order", error: error.message });
  }
};

