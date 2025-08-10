import express from "express";
import upload from "../middleware/uploadMiddleware.js";
import { protect, admin } from "../middleware/authMiddleware.js";
import {
  createEvent,
  getAllEvents,
  getEventById,
  getFilterOptions,        // Correct handler name
  getUpcomingEvents,
  getEventsByAdmin,  // add this
  deleteEvent,       // add this
  updateEvent    
} from "../controllers/eventController.js";

const router = express.Router();

router.post("/", protect, admin, upload.single("image"), createEvent);
router.get("/admin/:adminId", protect, admin, getEventsByAdmin);
router.delete("/:id", protect, admin, deleteEvent);
router.put("/:id", protect, admin, upload.single("image"), updateEvent);
router.get("/", getAllEvents);
router.get("/filters", getFilterOptions);  
router.get("/upcoming", getUpcomingEvents);
router.get("/:id", getEventById);

export default router;
