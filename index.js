import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import session from "express-session";
import dotenv from "dotenv";

import sequelize from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import providerRoutes from "./routes/providerRoutes.js";

dotenv.config();
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: "*", credentials: true }));
app.use(bodyParser.json());
app.use(express.json());
app.use(
  session({
    secret: process.env.JWT_SECRET || "default_secret",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, httpOnly: true, sameSite: "lax" },
  })
);

// Routes
app.use(authRoutes);
app.use(orderRoutes);
app.use(paymentRoutes);
app.use(providerRoutes);

app.get("/", (req, res) => {
  res.send("🚀 Server QuickTune aktif dengan Sequelize + Railway!");
});

// Start server + DB
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Connected to Railway DB!");
    await sequelize.sync({ alter: true }); // sync semua model

    app.listen(port, "0.0.0.0", () => {
      console.log(`✅ Server running on http://192.168.1.74:${port}`);
    });
  } catch (err) {
    console.error("❌ Unable to connect to DB:", err);
  }
};

startServer();
