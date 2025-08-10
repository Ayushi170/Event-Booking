import jwt from "jsonwebtoken";
import User from "../models/User.js";

// ✅ Middleware to protect routes
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({ message: "User not found" });
      }

      return next(); // ✅ Exit early
    } catch (error) {
      console.error("JWT Error:", error);
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  }else {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  // ✅ Moved outside try-catch and only triggers if no token present
  return res.status(401).json({ message: "Not authorized, no token" });
};

// ✅ Middleware to check admin
const admin = (req, res, next) => {
  console.log("User in admin middleware:", req.user); // ✅ for debugging
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Admin access only" });
  }
};

export { protect, admin };
