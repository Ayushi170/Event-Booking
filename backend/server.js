import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import path from 'path';

dotenv.config();
const app = express();

// Middleware - order important
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/bookings", bookingRoutes);
app.use('/uploads', express.static(path.join(path.resolve(), 'uploads')));

// Connect DB
console.log("Connecting to MongoDB...");
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error("DB Connection Error:", err));

// Test Route
app.get("/", (req, res) => {
  res.send("Event Booking API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
