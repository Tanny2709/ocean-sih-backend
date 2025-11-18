// routes/emergency.js
const express = require("express");
const router = express.Router();
const prisma = require("../db"); // ensure db.js exports `prisma` instance

// POST /api/emergencies
router.post("/", async (req, res) => {
  try {
    const { disasterType, safeLat, safeLng, instructions, expiresAt } = req.body;

    // Validate required field
    if (!disasterType) {
      return res.status(400).json({ error: "Disaster type is required" });
    }

    // Create new emergency
    const newEmergency = await prisma.emergencies.create({
      data: {
        name: disasterType,
        safe_lat: safeLat ? parseFloat(safeLat) : null,
        safe_lon: safeLng ? parseFloat(safeLng) : null,
        instructions: instructions || null,
        expires_at: expiresAt ? new Date(expiresAt) : null,
      },
    });

    res.status(201).json({
      message: "Emergency saved successfully",
      emergency: newEmergency,
    });
  } catch (err) {
    console.error("Error creating emergency:", err);
    res.status(500).json({ error: "Failed to save emergency" });
  }
});

module.exports = router;
