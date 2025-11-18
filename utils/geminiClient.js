const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY, // put your Gemini API key in .env
});

module.exports = genAI;
