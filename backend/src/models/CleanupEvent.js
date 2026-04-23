const mongoose = require("mongoose");

const cleanupEventSchema = new mongoose.Schema(
  {
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true
    },
    date: {
      type: Date,
      required: [true, "Date is required"]
    },
    totalKgCollected: {
      type: Number,
      required: [true, "Total kilograms collected is required"],
      min: [0, "Total kilograms cannot be negative"]
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("CleanupEvent", cleanupEventSchema);
