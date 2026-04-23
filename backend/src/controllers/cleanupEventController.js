const CleanupEvent = require("../models/CleanupEvent");

const createCleanupEvent = async (req, res) => {
  try {
    const { location, date, totalKgCollected } = req.body;

    if (!location || !date || totalKgCollected === undefined) {
      return res.status(400).json({
        message: "location, date, and totalKgCollected are required"
      });
    }

    const event = await CleanupEvent.create({
      location,
      date,
      totalKgCollected
    });

    return res.status(201).json(event);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to create cleanup event",
      error: error.message
    });
  }
};

const getCleanupEvents = async (_req, res) => {
  try {
    const events = await CleanupEvent.find().sort({ date: -1 });
    return res.status(200).json(events);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch cleanup events",
      error: error.message
    });
  }
};

module.exports = {
  createCleanupEvent,
  getCleanupEvents
};
