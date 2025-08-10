import express from "express";
import { protect, admin } from "../middleware/authMiddleware.js";
import {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getAdminAccess,
  verifyToken, // ✅ Token verification controller
} from "../controllers/authController.js";

const router = express.Router();

// -----------------------
// Public routes
// -----------------------
router.post("/register", registerUser);
router.post("/login", loginUser);

// -----------------------
// Token verification route
// -----------------------
router.get("/verify-token", protect, verifyToken);

// -----------------------
// Protected user routes
// -----------------------
router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, updateUserProfile);

// -----------------------
// Protected admin route
// -----------------------
router.get("/admin", protect, admin, getAdminAccess);

export default router;
