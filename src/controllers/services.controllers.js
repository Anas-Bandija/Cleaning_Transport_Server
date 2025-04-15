import { uploadOnCloudinary } from "../utils/cloudinary.js";
import ServiceModel from "../models/service.model.js";

export const addService = async (req, res) => {
    try {
        const { title, description, category } = req.body;

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

        const newService = await ServiceModel.create({
            title,
            description,
            category,
            image: imageResponse.secure_url,
            user: userId, // ✅ Add the user ID here
        });

        res.status(201).json({ success: true, message: "Service Added Successfully!", data: newService });
    } catch (error) {
        console.error("Add Service Error:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};


export const getAllServices = async (req, res) => {
    try {
        const services = await ServiceModel.find().sort({ createdAt: -1 }); // optional: latest first
        res.status(200).json({ success: true, data: services });
    } catch (error) {
        console.error("Fetch Services Error:", error);
        res.status(500).json({ success: false, message: "Failed to fetch services" });
    }
};


export const editService = async (req, res) => {
    try {
        const { title, description, category } = req.body;
        const { id } = req.params;
        const userId = req.user.id;

        const service = await ServiceModel.findById(id);
        if (!service) {
            return res.status(404).json({ success: false, message: "Service not found." });
        }

        if (service.user.toString() !== userId) {
            return res.status(403).json({ success: false, message: "Forbidden: You don't own this service." });
        }

        // If a new image is uploaded, upload to Cloudinary
        let updatedImageUrl = service.image;
        if (req.file?.path) {
            const imageResponse = await uploadOnCloudinary(req.file.path);
            updatedImageUrl = imageResponse.secure_url;
        }

        // Update the fields
        service.title = title || service.title;
        service.description = description || service.description;
        service.category = category || service.category;
        service.image = updatedImageUrl;

        await service.save();

        res.status(200).json({ success: true, message: "Service updated successfully.", data: service });
    } catch (error) {
        console.error("Edit Service Error:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

export const deleteService = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const service = await ServiceModel.findById(id);
        if (!service) {
            return res.status(404).json({ success: false, message: "Service not found." });
        }

        if (service.user.toString() !== userId) {
            return res.status(403).json({ success: false, message: "Forbidden: You don't own this service." });
        }

        await ServiceModel.findByIdAndDelete(id);

        res.status(200).json({ success: true, message: "Service deleted successfully." });
    } catch (error) {
        console.error("Delete Service Error:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};
