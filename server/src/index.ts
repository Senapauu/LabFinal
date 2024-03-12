import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoutes from "./routes/auth";
import productRoutes from "./routes/products";
import cartRoutes from "./routes/cart";
import deliveryRoutes from "./routes/delivery";
import favoritesRoutes from "./routes/favorites";

const app = express();
const PORT = 3001;

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/delivery", deliveryRoutes);
app.use("/api/favorites", favoritesRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
