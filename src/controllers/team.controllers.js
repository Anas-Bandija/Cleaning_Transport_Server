import { uploadOnCloudinary } from "../utils/cloudinary.js";
import teamModel from "../models/team.model.js";

export const addteam = async (req, res) => {
    try {
        const { name, about, role } = req.body;

        // Check if user is attached to the request (by middleware)
        const userId = req.user.id;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized: User not found." });
        }

        // Image Upload
        const imageLocalPath = req.file?.path;
        if (!imageLocalPath) {
            return res.status(400).json({ success: false, message: "Image is required." });
        }

        const imageResponse = await uploadOnCloudinary(imageLocalPath);

        const newteam = await teamModel.create({
            name,
            about,
            role,
            image: imageResponse.secure_url,
            user: userId, // ✅ Add the user ID here
        });

        res.status(201).json({ success: true, message: "team Added Successfully!", data: newteam });
    } catch (error) {
        console.error("Add team Error:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};


export const getAllteams = async (req, res) => {
    try {
        const teams = await teamModel.find().sort({ createdAt: -1 }); // optional: latest first
        res.status(200).json({ success: true, data: teams });
    } catch (error) {
        console.error("Fetch teams Error:", error);
        res.status(500).json({ success: false, message: "Failed to fetch teams" });
    }
};


export const editteam = async (req, res) => {
    try {
        const { title, description, category } = req.body;
        const { id } = req.params;
        const userId = req.user.id;

        const team = await teamModel.findById(id);
        if (!team) {
            return res.status(404).json({ success: false, message: "team not found." });
        }

        if (team.user.toString() !== userId) {
            return res.status(403).json({ success: false, message: "Forbidden: You don't own this team." });
        }

        // If a new image is uploaded, upload to Cloudinary
        let updatedImageUrl = team.image;
        if (req.file?.path) {
            const imageResponse = await uploadOnCloudinary(req.file.path);
            updatedImageUrl = imageResponse.secure_url;
        }

        // Update the fields
        team.title = title || team.title;
        team.description = description || team.description;
        team.category = category || team.category;
        team.image = updatedImageUrl;

        await team.save();

        res.status(200).json({ success: true, message: "team updated successfully.", data: team });
    } catch (error) {
        console.error("Edit team Error:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

export const deleteteam = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const team = await teamModel.findById(id);
        if (!team) {
            return res.status(404).json({ success: false, message: "team not found." });
        }

        if (team.user.toString() !== userId) {
            return res.status(403).json({ success: false, message: "Forbidden: You don't own this team." });
        }

        await teamModel.findByIdAndDelete(id);

        res.status(200).json({ success: true, message: "team deleted successfully." });
    } catch (error) {
        console.error("Delete team Error:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};
