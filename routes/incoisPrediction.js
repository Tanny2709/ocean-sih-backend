// routes/incoisPredictions.js
const express = require("express");
const router = express.Router();
const prisma = require("../db");

// GET all predictions (latest first)
router.get("/", async (req, res) => {
  try {
    const predictions = await prisma.incois_predictions.findMany({
      orderBy: { issued_at: "desc" },
    });
    res.json(predictions);
  } catch (err) {
    console.error("Error fetching incois predictions:", err);
    res.status(500).json({ error: "Failed to fetch incois predictions" });
  }
});

module.exports = router;
