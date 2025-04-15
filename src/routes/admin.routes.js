import express from "express"
import { createAdmin, adminLogin } from "../controllers/admin.controllers.js"

const router = express.Router()

// Route to register/create a new admin
router.post("/create", createAdmin)

// Route to log in as admin
router.post("/login", adminLogin)

export default router
