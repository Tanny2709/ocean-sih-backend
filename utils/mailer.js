const nodemailer = require("nodemailer");

// Configure transporter
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465, // 465 for SSL, 587 for TLS
  secure: true, // true for 465, false for 587
  auth: {
    user: process.env.EMAIL_USER, // your Gmail
    pass: process.env.EMAIL_PASS, // Gmail app password
  },
});

const sendMail = async ({ to, subject, text, html }) => {
  try {
    // Accept array of emails or string
    const recipients = Array.isArray(to) ? to.join(",") : to;

    const info = await transporter.sendMail({
      from: `"Hazard Alert" <${process.env.EMAIL_USER}>`,
      to: recipients,
      subject,
      text,
      html, // optional HTML content
    });

    console.log("Message sent:", info.messageId);
    return info;
  } catch (err) {
    console.error("Error sending mail:", err);
    throw err; // propagate error
  }
};

module.exports = sendMail;
