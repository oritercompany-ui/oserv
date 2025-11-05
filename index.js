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

const port = process.env.PORT || 3000; // fallback
app.listen(port, async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected!");
  } catch (err) {
    console.error("Unable to connect to DB:", err);
  }
});

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


app.listen(port, "0.0.0.0", () => {
  console.log(`✅ Server running on http://192.168.1.74:${port}`);
});
