import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import session from "express-session";
import authRoutes from "./routes/authRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import dotenv from "dotenv";
import paymentRoutes from "./routes/paymentRoutes.js";
import providerRoutes from "./routes/providerRoutes.js";
import { UUID } from "sequelize";

dotenv.config(); // 🧩 aktifkan dotenv
const app = express();

//(async () => {
  //await Order.sync({ alter: true });
//})();

// ✅ Ganti dengan IP laptop kamu (cek pakai `ipconfig` di CMD)
const allowedOrigin = "*"; // contoh Expo dev

app.use(
  cors({
    origin: allowedOrigin,
    credentials: true,
  })
);

app.use(bodyParser.json());
app.use(express.json());

app.use(
  session({
    secret: process.env.JWT_SECRET || "default_secret", // 🧩 pakai dari .env
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      httpOnly: true,
      sameSite: "lax",
    },
  })
);

app.get("/", (req, res) => {
  res.send("🚀 Server QuickTune aktif!");
});

app.use(authRoutes);         // /users/:id
app.use(orderRoutes);    
app.use(paymentRoutes);    // ✅ POST /orders
app.use(providerRoutes);


const PORT = process.env.PORT || 5000; 
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server running on http://192.168.1.74:${PORT}`);
});
