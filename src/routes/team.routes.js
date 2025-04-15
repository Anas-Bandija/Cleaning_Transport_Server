import express from "express";
import multer from "multer";
import { addteam, deleteteam, editteam, getAllteams } from "../controllers/team.controllers.js";
import userAuthenticate from "../middlewares/user.authenticate.middleware.js";

const router = express.Router();

// Multer setup for handling image upload
const storage = multer.diskStorage({});
const upload = multer({ storage });
router.get("/", getAllteams)
router.put("/edit/:id", userAuthenticate, upload.single("image"), editteam);
router.delete("/delete/:id", userAuthenticate, deleteteam);
router.post(
  "/add",
  userAuthenticate,      // Auth middleware
  upload.single("image"), // Image upload
  addteam              // Controller
);

export default router;
