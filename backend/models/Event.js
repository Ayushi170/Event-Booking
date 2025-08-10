import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true }, // Matches controller
  date: { type: Date, required: true }, // For sorting & filtering
  time: { type: String, required: true },
  venue: { type: String, required: true },
  category: { type: String, required: true }, // Used in filters
  location: { type: String, required: true }, // Matches controller
  price: { type: Number, required: true },
  seatLimit: { type: Number, required: true },
  seatsBooked: { type: Number, default: 0 },
  image: { type: String, required: false },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }

}, { timestamps: true });

export default mongoose.model("Event", eventSchema);
