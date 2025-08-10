// controllers/eventController.js
import Event from "../models/Event.js";


/**
 * @desc Create a new event (Admin only)
 * @route POST /api/events
 * @access Private/Admin
 */
export const createEvent = async (req, res) => {
  try {
    const { name, description, date, category, location, price, time, venue, seatLimit } = req.body;

    // Validate required fields
    if (!name || !description || !date || !category || !location || price === undefined || !time || !venue || !seatLimit) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const event = await Event.create({
      name,
      description,
      date: new Date(date),
      category,
      location,
      price: parseFloat(price),
      time,
      venue,
      seatLimit: Number(seatLimit),
      image: req.file ? `/uploads/${req.file.filename}` : null,
      createdBy: req.user._id,  
    });

    res.status(201).json({
      message: "Event created successfully.",
      event,
    });
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({ message: "Server error while creating event." });
  }
};
export const getEventsByAdmin = async (req, res) => {
  try {
    const adminId = req.params.adminId.trim();  // Trim whitespace/newlines
    console.log("Admin ID from params:", adminId);

    const events = await Event.find({ createdBy: adminId });

    if (!events.length) {
      return res.status(404).json({ message: "No events found for this admin." });
    }

    res.json(events);
  } catch (error) {
    console.error("Error in getEventsByAdmin:", error);
    res.status(500).json({ message: "Server error while fetching events." });
  }
};

// Delete event
export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) return res.status(404).json({ message: "Event not found" });

    await event.deleteOne();
    res.json({ message: "Event deleted successfully." });
  } catch (error) {
    console.error("Error deleting event:", error);
    res.status(500).json({ message: "Server error while deleting event." });
  }
};

// Update event
export const updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    const { name, description, date, category, location, price, time, venue, seatLimit } = req.body;

    event.name = name || event.name;
    event.description = description || event.description;
    event.date = date ? new Date(date) : event.date;
    event.category = category || event.category;
    event.location = location || event.location;
    event.price = price !== undefined ? parseFloat(price) : event.price;
    event.time = time || event.time;
    event.venue = venue || event.venue;
    event.seatLimit = seatLimit !== undefined ? Number(seatLimit) : event.seatLimit;

    if (req.file) {
      event.image = `/uploads/${req.file.filename}`;
    }

    const updatedEvent = await event.save();
    res.json({ message: "Event updated successfully", event: updatedEvent });
  } catch (error) {
    console.error("Error updating event:", error);
    res.status(500).json({ message: "Server error while updating event." });
  }
};


/**
 * @desc Get all events with optional filters
 * @route GET /api/events
 * @access Public
 */
export const getAllEvents = async (req, res) => {
  try {
    const { location, category, price } = req.query;
    const filter = {};

    if (location) filter.location = new RegExp(`^${location}$`, "i");
    if (category) filter.category = new RegExp(`^${category}$`, "i");
    if (price) filter.price = { $lte: Number(price) };

    const events = await Event.find(filter).sort({ date: 1 });

    res.status(200).json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ message: "Server error while fetching events." });
  }
};

/**
 * @desc Get unique filter options (locations, categories)
 * @route GET /api/events/filters
 * @access Public
 */
export const getFilterOptions = async (req, res) => {
  try {
    const locations = await Event.distinct("location");
    const categories = await Event.distinct("category");

    res.status(200).json({ locations, categories });
  } catch (error) {
    console.error("Error fetching filter options:", error);
    res.status(500).json({ message: "Server error while fetching filter options." });
  }
};

/**
 * @desc Get single event by ID
 * @route GET /api/events/:id
 * @access Public
 */
export const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.status(200).json(event);
  } catch (error) {
    console.error("Error fetching event by ID:", error);
    res.status(500).json({ message: "Server error while fetching event." });
  }
};

// Add this function alongside other exports in eventController.js
export const getUpcomingEvents = async (req, res) => {
  try {
    const now = new Date();
    const upcomingEvents = await Event.find({ date: { $gte: now } }).sort({ date: 1 });
    res.status(200).json(upcomingEvents);
  } catch (error) {
    console.error("Error fetching upcoming events:", error);
    res.status(500).json({ message: "Server error while fetching upcoming events." });
  }
};

