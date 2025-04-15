import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import adminRoutes from "./routes/admin.routes.js" // 👈 import admin routes
import serviceRoutes from "./routes/services.routes.js";// 👈 import services routes
import teamRoutes from "./routes/team.routes.js";// 👈 import services routes

const app = express()

// Middlewares
app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ limit: "16kb", extended: true }))
app.use(cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000", // allow frontend origin
    credentials: true // allow cookies to be sent
}));
app.use(cookieParser())
app.use(express.static("public"))

// Admin routes
app.use("/api/v1/admin", adminRoutes) // 👈 mount admin routes
app.use("/api/service", serviceRoutes);
app.use("/api/team", teamRoutes);

export { app }
