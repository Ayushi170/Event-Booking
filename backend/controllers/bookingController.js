import Booking from "../models/Booking.js";
import Event from "../models/Event.js";

const backendUrl = (process.env.BACKEND_URL || "http://localhost:5000").replace(/\/+$/, "");

// @desc Book an event
export const bookEvent = async (req, res) => {
  try {
    console.log("---- Book Event called ----");
    const userId = req.user._id;
    const eventId = req.params.eventId;
    const { seats } = req.body; // Expecting number

    // 1. Check if user already booked this event
    const existingBooking = await Booking.findOne({ userId, eventId });
    if (existingBooking) {
      console.log("User already booked this event");
      return res.status(400).json({ message: "You have already booked this event." });
    }

    const seatCount = Number(seats);
    if (!seatCount || seatCount <= 0) {
      return res.status(400).json({ message: "Invalid number of seats" });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      console.log("Event not found");
      return res.status(404).json({ message: "Event not found" });
    }

    if (event.seatsBooked + seatCount > event.seatLimit) {
      console.log("Not enough seats available");
      return res.status(400).json({ message: "Not enough seats available" });
    }

    // Update booked seat count
    event.seatsBooked += seatCount;
    await event.save();

    // Create booking with seats as number
    const booking = await Booking.create({
      userId,
      eventId,
      seats: seatCount,
      bookingDate: new Date(),
    });

    // Populate event details for response
    await booking.populate("eventId");

    // Prepare image URL correctly
    let imagePath = "";
    if (booking.eventId.image) {
      imagePath = booking.eventId.image.startsWith("/")
        ? booking.eventId.image
        : "/" + booking.eventId.image;
    }

    res.status(201).json({
      _id: booking._id,
      buyer: req.user.name,
      seats: booking.seats,
      total: booking.seats * booking.eventId.price,
      event: {
        title: booking.eventId.title || booking.eventId.name,
        date: booking.eventId.date,
        image: booking.eventId.image && booking.eventId.image.startsWith("http")
          ? booking.eventId.image
          : backendUrl + imagePath,
      },
      bookingDate: booking.bookingDate,
    });
  } catch (error) {
    console.error("Booking Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc Get current user's booking history
export const getMyBookings = async (req, res) => {
  try {
    console.log("---- Get My Bookings called ----");
    const bookings = await Booking.find({ userId: req.user._id })
      .populate("eventId")
      .sort({ bookingDate: -1 });

    console.log("Found bookings count:", bookings.length);

    res.json(
      bookings.map((booking) => {
        let imagePath = "";
        if (booking.eventId?.image) {
          imagePath = booking.eventId.image.startsWith("/")
            ? booking.eventId.image
            : "/" + booking.eventId.image;
        }

        return {
          _id: booking._id,
          seats: booking.seats,
          bookingDate: booking.bookingDate,
          eventId: {
            _id: booking.eventId._id,
            title: booking.eventId.title || booking.eventId.name,
            date: booking.eventId.date,
            image: booking.eventId.image?.startsWith("http")
              ? booking.eventId.image
              : backendUrl + imagePath,
          },
        };
      })
    );
  } catch (error) {
    console.error("Get Bookings Error:", error);
    res.status(500).json({ message: error.message });
  }
};
