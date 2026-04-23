const express = require("express");
const {
  createCleanupEvent,
  getCleanupEvents
} = require("../controllers/cleanupEventController");

const router = express.Router();

router.post("/", createCleanupEvent);
router.get("/", getCleanupEvents);

module.exports = router;
