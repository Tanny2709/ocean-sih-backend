// routes/analystReports.js
const express = require("express");
const router = express.Router();
const prisma = require("../db");

router.post("/", async (req, res) => {
  // Accept camelCase from frontend
  const { disasterType, safeLat, safeLng, instructions } = req.body;

  try {
    const savedReport = await prisma.analystreports.create({
      data: {
        disastertype: disasterType,       // map camelCase -> lowercase
        safelat: safeLat ? parseFloat(safeLat) : null,
        safelng: safeLng ? parseFloat(safeLng) : null,
        instructions,
      },
    });
    res.json(savedReport);
  } catch (err) {
    console.error("Prisma Error:", err);
    res.status(500).json({ error: "Failed to save analyst report" });
  }
});

// routes/analystReports.js
router.get("/", async (req, res) => {
  try {
    const reports = await prisma.analystreports.findMany({
      orderBy: { created_at: "desc" }
    });
    res.json(reports);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch reports" });
  }
});


module.exports = router;
