import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { bookEvent, getMyBookings } from "../controllers/bookingController.js";

const router = express.Router();

// Book an Event (POST /api/bookings/:eventId)
router.post("/:eventId", protect, bookEvent);

// Get User’s Booking History (GET /api/bookings/history)
router.get("/history", protect, getMyBookings);

export default router;
