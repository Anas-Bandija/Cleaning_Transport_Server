import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "Token is required" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "yoursecret");
        console.log(decoded)
        req.user = decoded; // Set the decoded token to req.user
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};

export default authMiddleware;
