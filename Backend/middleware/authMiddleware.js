const jwt = require("jsonwebtoken");
const User = require("../models/user");

const protect = async (req, res, next) => {
    let token;
    
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        // console.log("Headers received:", req.headers.authorization);
        try {
            token = req.headers.authorization.split(" ")[1];

            if (!token || token === "null" || token === "undefined") {
                return res.status(401).json({ message: "Not authorized, invalid token" });
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            req.user = await User.findById(decoded.id).select("-password");
            if (!req.user) {
            console.log("Error: User not found in database for this token.");
            return res.status(401).json({ message: "User not found" });
        }

            next();
        } catch (error) {
            console.error("Auth Error:", error.message);
            res.status(401).json({ message: "Token is invalid or malformed" });
        }
    } else {
        res.status(401).json({ message: "Not authorized, no token" });
    }
};

const admin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next();
    } else {
        console.log("Admin check failed: User is not admin");
        res.status(401).json({ message: "Not authorized as an admin" });
    }
};

module.exports = { protect, admin };