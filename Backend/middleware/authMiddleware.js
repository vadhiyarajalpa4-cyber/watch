const jwt = require("jsonwebtoken");
const User = require("../models/user");

// 1. Protect Middleware (Ensures the user is logged in)
const protect = async (req, res, next) => {
    let token;
    
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        // console.log("Headers received:", req.headers.authorization); // <--- ADD THIS
        try {
            token = req.headers.authorization.split(" ")[1];

            // 1. ADD THIS CHECK: Prevent "jwt malformed" from null/undefined strings
            if (!token || token === "null" || token === "undefined") {
                return res.status(401).json({ message: "Not authorized, invalid token" });
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            req.user = await User.findById(decoded.id).select("-password");

            // 2. Ensure user still exists in DB
            // if (!req.user) {
            //     return res.status(401).json({ message: "User no longer exists" });
            // }
            if (!req.user) {
            console.log("Error: User not found in database for this token.");
            return res.status(401).json({ message: "User not found" });
        }

            next();
        } catch (error) {
            console.error("Auth Error:", error.message);
            // Specifically catching malformed errors to send a clean response
            res.status(401).json({ message: "Token is invalid or malformed" });
        }
    } else {
        res.status(401).json({ message: "Not authorized, no token" });
    }
};

// 2. Admin Middleware (Ensures the logged-in user is an Admin)
const admin = (req, res, next) => {
    // Check if the user exists and if their isAdmin property is true
    if (req.user && req.user.isAdmin) {
        next();
    } else {
        console.log("Admin check failed: User is not admin");
        res.status(401).json({ message: "Not authorized as an admin" });
    }
};

module.exports = { protect, admin };