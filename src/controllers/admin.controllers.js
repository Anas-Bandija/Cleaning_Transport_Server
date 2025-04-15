import { sendResponce } from "../utils/sendResponce.js"
import jwt from "jsonwebtoken"
import Admin from "../models/admin.model.js"

const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return sendResponce(res, 400, null, true, "Email and password are required");
        }

        const admin = await Admin.findOne({ email });

        if (!admin) {
            return sendResponce(res, 401, null, true, "Invalid credentials");
        }

        const isMatch = await admin.comparePassword(password);
        if (!isMatch) {
            return sendResponce(res, 401, null, true, "Invalid credentials");
        }

        const token = jwt.sign(
            { id: admin._id, email: admin.email, role: "admin" },
            process.env.JWT_SECRET || "yoursecret",
            { expiresIn: "1d" }
        );

        return sendResponce(res, 200, { token }, false, "Admin logged in successfully");

    } catch (error) {
        console.error("Login Error:", error);
        return sendResponce(res, 500, null, true, "Something went wrong");
    }
};

const createAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return sendResponce(res, 400, null, true, "Email and password are required");
        }

        // Check if admin already exists
        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return sendResponce(res, 409, null, true, "Admin with this email already exists");
        }

        // Create and save new admin (password will be hashed by pre-save hook)
        const newAdmin = new Admin({ email, password });
        await newAdmin.save();

        return sendResponce(res, 201, { email: newAdmin.email }, false, "Admin account created successfully");
    } catch (error) {
        console.error("Create Admin Error:", error);
        return sendResponce(res, 500, null, true, "Something went wrong");
    }
};


export { adminLogin, createAdmin };
