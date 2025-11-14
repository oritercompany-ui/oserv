import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import sequelize from "./config/db.js";
import dotenv from "dotenv";

import Role from "./models/roleModel.js";
import Auth from "./models/authModel.js";
import Order from "./models/orderModel.js";
import Payment from "./models/paymentModel.js";

import authRoutes from "./routes/authRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import providerRoutes from "./routes/providerRoutes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use(authRoutes);
app.use(orderRoutes);
app.use(paymentRoutes);
app.use(providerRoutes);

// Create HTTP server + Socket.IO
const server = http.createServer(app);
export const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Socket.IO connection
io.on("connection", (socket) => {
  console.log("🚀 User connected:", socket.id);
  socket.on("disconnect", () => console.log("❌ User disconnected:", socket.id));
});

// ---------------- START SERVER ----------------
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Connected to DB!");

    // Matikan FK sementara
    await sequelize.query("SET FOREIGN_KEY_CHECKS = 0;");

    // Hapus tabel Order (Pesanans lama) saja
    await Order.drop().catch(() => {
      console.log("⚠️ Tabel Order tidak ditemukan atau gagal di-drop");
    });

    // Aktifkan FK lagi
    await sequelize.query("SET FOREIGN_KEY_CHECKS = 1;");

    // Sinkronisasi tabel lain
    await Role.sync({ alter: true });
    await Auth.sync({ alter: true });
    await Order.sync({ alter: true }); // otomatis bikin ulang Order
    await Payment.sync({ alter: true });
    console.log("🔥 Models tersinkron");

    // Seed role awal
    const roles = [
      { name: "user", description: "User biasa" },
      { name: "provider", description: "Mekanik / Provider" },
      { name: "admin", description: "Administrator" },
    ];
    for (const role of roles) {
      await Role.findOrCreate({ where: { name: role.name }, defaults: role });
    }
    console.log("✅ Role awal berhasil diset");

    // Jalankan server lokal (bukan serverless)
    if (process.env.NODE_ENV !== "production") {
      server.listen(port, () =>
        console.log(`Server berjalan di http://localhost:${port}`)
      );
    }
  } catch (err) {
    console.error("❌ DB ERROR:", err);
  }
};

// Jalankan server
startServer();

// Export app untuk Vercel serverless
export default app;
