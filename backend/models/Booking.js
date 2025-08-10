import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
  seats: { type: Number, required: true },
  bookingDate: { type: Date, default: Date.now }
});

// Add unique index to prevent duplicate bookings by same user for same event
bookingSchema.index({ userId: 1, eventId: 1 }, { unique: true });

export default mongoose.model("Booking", bookingSchema);
