// controllers/transcribeController.js
const fetch = require("node-fetch");
const fs = require("fs");
const path = require("path");
const ffmpeg = require("fluent-ffmpeg");
const { GoogleGenAI, createUserContent } = require("@google/genai");

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function downloadFile(url, dest) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to fetch: ${res.statusText}`);
    const buffer = await res.arrayBuffer();
    fs.writeFileSync(dest, Buffer.from(buffer));
    return dest;
}

async function convertToMp3(inputPath) {
    const outputPath = inputPath.replace(path.extname(inputPath), ".mp3");
    await new Promise((resolve, reject) => {
        ffmpeg(inputPath)
            .toFormat("mp3")
            .save(outputPath)
            .on("end", resolve)
            .on("error", reject);
    });
    return outputPath;
}

async function transcribeGemini(req, res) {
    const { url } = req.query;
    if (!url) return res.status(400).json({ error: "Missing audio URL" });

    const urlClean = url.trim(); // remove \n or spaces
    const ext = path.extname(urlClean).split("?")[0]; // remove query params
    const tempFile = path.join(__dirname, `temp-${Date.now()}${ext}`);

    

    try {
        // await downloadFile(url, tempFile);
        await downloadFile(urlClean, tempFile);
        const mp3File = await convertToMp3(tempFile);
        const audioBase64 = fs.readFileSync(mp3File).toString("base64");

        const result = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: createUserContent([
                { inlineData: { mimeType: "audio/mpeg", data: audioBase64 } },
                { text: "Generate a transcript of the speech." },
            ]),
        });

        fs.unlinkSync(tempFile);
        fs.unlinkSync(mp3File);

        res.json({ text: result.text });
    } catch (err) {
        console.error("Gemini transcription error:", err);
        res.status(500).json({ error: "Failed to transcribe audio" });
    }
}


module.exports = { transcribeGemini };
