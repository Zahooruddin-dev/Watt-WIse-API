import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import brandRoutes from "./routes/brandRoutes.js";
import applianceRoutes from "./routes/applianceRoutes.js";
import statsRoutes from "./routes/statsRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    name: "WattWise PK API",
    version: "1.0.0",
    description: "Open source Pakistani appliance wattage and pricing data",
    docs: "https://github.com/Zahooruddin-dev/Watt-WIse-API#readme",
    endpoints: {
      auth: "/api/auth",
      appliances: "/api/appliances",
      brands: "/api/brands",
      categories: "/api/categories",
      stats: "/api/stats",
    },
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/brands", brandRoutes);
app.use("/api/appliances", applianceRoutes);
app.use("/api/stats", statsRoutes);

app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal server error" });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`WattWise PK API running on port ${PORT}`);
});

export default app;