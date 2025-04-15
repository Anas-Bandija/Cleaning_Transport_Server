import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import adminRoutes from "./routes/admin.routes.js";
import serviceRoutes from "./routes/services.routes.js";
import teamRoutes from "./routes/team.routes.js";

const app = express();

// Middlewares
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ limit: "16kb", extended: true }));
app.use(cors({
  origin: process.env.CORS_ORIGIN || "http://localhost:3000",
  credentials: true
}));
app.use(cookieParser());
app.use(express.static("public"));

// 🔥 Hello World on root
app.get("/", (req, res) => {
  res.send("Hello World");
});

// Routes
app.use("/api/v1/admin", adminRoutes);
app.use("/api/service", serviceRoutes);
app.use("/api/team", teamRoutes);

export { app };
