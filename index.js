const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const reportRoutes=require('./routes/reportRoutes')
const alertRoutes = require("./routes/alertRoutes");
const mlModelOutputs = require('./routes/mlModelOutputs')
const incoisPrediction = require("./routes/incoisPrediction");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/reports", reportRoutes);
app.use('/api/auth', authRoutes);
app.use("/api/alerts", alertRoutes);
app.use("/api/incois-prediction", incoisPrediction);
app.use("/api/ml-model-outputs", mlModelOutputs);
app.use("/api/analyst-reports", require("./routes/analystReports"));
app.use('/api/emergencies', require('./routes/emergency'));

const { AssemblyAI } = require('assemblyai');
app.post('/api/transcribe', async (req, res) => {
  const { audioUrl } = req.body;

  if (!audioUrl) {
    return res.status(400).json({ error: 'audioUrl is required' });
  }

  // Initialize the AssemblyAI client
  const client = new AssemblyAI({
    apiKey: process.env.ASSEMBLYAI_API_KEY,
  });

  try {
    // Request transcription from the audio URL
    const transcript = await client.transcripts.transcribe({
      audio: audioUrl,
    });

    if (transcript.status === 'error') {
        return res.status(500).json({ error: transcript.error });
    }

    res.json({ transcription: transcript.text });

  } catch (err) {
    console.error('Transcription Error:', err);
    res.status(500).json({ error: 'Failed to transcribe audio.' });
  }
});

app.get("/api/ping", (req, res) => {
  res.json({ message: "pong" });
});

const PORT = process.env.PORT || 5000;


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
