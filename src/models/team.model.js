import mongoose from "mongoose";

const teamSchema = new mongoose.Schema({
    name: { type: String, required: true },
    about: { type: String, required: true },
    role: { type: String, required: true },
    image: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
}, { timestamps: true });

const Team = mongoose.model("team", teamSchema);
export default Team