const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const mongoose = require("mongoose");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const Interview = require("./chat");
const Topic = require("./questions");
const protect = require("./authMiddleware");
const connectDB = require("./db");
require("dotenv").config();

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());

// Diagnostic Logger
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`, req.body);
  next();
});

// Health Check
app.get("/api/interview/health", (req, res) => {
  res.json({ status: "ok", service: "interview-service", db: mongoose.connection.readyState === 1 ? "connected" : "disconnected" });
});

connectDB().then(() => {
  const PORT = process.env.PORT || 5002;
  app.listen(PORT, () => console.log(`Interview Service running on port ${PORT}`));
}).catch(err => {
  console.error("Failed to start Interview Service:", err);
  process.exit(1);
});

app.get("/api/interview/results", protect, async (req, res) => {
  try {
    const user = req.email;
    if (!user) return res.status(400).json({ message: "User parameter is required" });
    const userInterviews = await Interview.find({ user }, 'topic interviewData');
    if (userInterviews.length > 0) {
      res.json(userInterviews);
    } else {
      res.status(404).json({ message: "No topics found for the specified user" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/api/interview/chat", protect, async (req, res) => {
  const { topic, interviewData } = req.body;
  const user = req.email;
  try {
    const updateOperation = Array.isArray(interviewData)
      ? { $push: { interviewData: { $each: interviewData } } }
      : { $push: { interviewData } };
    await Interview.updateOne({ user, topic }, updateOperation, { upsert: true });
    res.status(200).json({ message: "Data successfully updated" });
  } catch (error) {
    res.status(500).json({ error: "Failed to append data" });
  }
});

app.post("/api/interview/gemini", protect, async (req, res) => {
  try {
    const apiKey = process.env.API_KEY_GEMINI;
    if (!apiKey || apiKey === "no_key_provided") {
        return res.status(500).json({ error: "Gemini API key not configured in environment." });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const prompt = `Given the input "${req.body.body}". Now check the syllabus for this interview and find questions and store them ,provided a sample JSON object with the following format:

{
  "OSI": [
    "Question 1 about OSI?",
    "Question 2 about OSI?",
    "Question 3 about OSI?"
  ],
  "OI": [
    "Question 1 about OI?",
    "Question 2 about OSI?",
    "Question 3 about OSI?"
  ]
};

Ensure the response includes 3 questions from each topic one easy one medium and one hard and atleast 5 topics, 

Return ONLY the JSON object, with no additional text.
 `;
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    res.send(JSON.parse(result.response.text()));
  } catch (err) {
    console.error("Gemini Error:", err);
    res.status(500).json({ error: err.message });
  }
});
