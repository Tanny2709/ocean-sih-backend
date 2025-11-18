const express = require("express");
// const fetch = require("node-fetch"); // Make sure you installed node-fetch
const router = express.Router();

router.post("/", async (req, res) => {
  const { audioUrl } = req.body;

  if (!audioUrl) {
    return res.status(400).json({ error: "audioUrl is required" });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "whisper-1",
        audio_url: audioUrl,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      return res.json({ transcription: data.text });
    } else {
      return res.status(response.status).json({ error: data });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
