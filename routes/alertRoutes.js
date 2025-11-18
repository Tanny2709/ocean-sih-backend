const express = require("express");
const sendMail = require("../utils/mailer");

const router = express.Router();

router.post("/", async (req, res) => {
  const { reportId, emails } = req.body;

  if (!emails || emails.length === 0) {
    return res.status(400).json({ message: "No departments selected" });
  }

  try {
    // Simulate email content
    const subject = 'Hazard Alert for Report';
    const text = 'Flood is detected in your area. Please take necessary precautions visible in the app.';

    await sendMail({ to: emails.join(","), subject, text });

    res.json({ message: "Emails sent successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to send emails" });
  }
});

module.exports = router;
