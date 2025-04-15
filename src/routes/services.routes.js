import express from "express";
import multer from "multer";
import { addService, deleteService, editService, getAllServices } from "../controllers/services.controllers.js";
import userAuthenticate from "../middlewares/user.authenticate.middleware.js";

const router = express.Router();

// Multer setup for handling image upload
const storage = multer.diskStorage({});
const upload = multer({ storage });
router.get("/", getAllServices)
router.put("/edit/:id", userAuthenticate, upload.single("image"), editService);
router.delete("/delete/:id", userAuthenticate, deleteService);
router.post(
  "/add",
  userAuthenticate,      // Auth middleware
  upload.single("image"), // Image upload
  addService              // Controller
);

export default router;
