// routes/mlModelOutputs.js
const express = require("express");
const router = express.Router();
const prisma = require("../db");

router.get("/", async (req, res) => {
  console.log("✅ /api/ml-model-outputs hit!");
  try {
    const outputs = await prisma.ml_model_outputs.findMany({
      orderBy: { predicted_at: "desc" },
    });
    res.json(outputs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch ML model outputs" });
  }
});


module.exports = router;
