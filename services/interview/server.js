const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const mongoose = require("mongoose");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const Groq = require("groq-sdk");
const Interview = require("./chat");
const Topic = require("./questions");
const protect = require("./authMiddleware");
const connectDB = require("./db");
require("dotenv").config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

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
    // Return empty array instead of 404 for new users
    res.json(userInterviews || []);
  } catch (error) {
    console.error("Results fetch error:", error);
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
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey || apiKey === "no_key_provided") {
        return res.status(500).json({ error: "Groq API key not configured." });
    }

    const topic = req.body.body;
    const prompt = `Generate interview questions for the topic: "${topic}". 
Return a JSON object EXACTLY in this format:
{
  "Topic Name": [
    "Question 1?",
    "Question 2?",
    "Question 3?"
  ]
}
Requirements:
1. Include at least 5 sub-topics.
2. Provide 3 questions per sub-topic (Easy, Medium, Hard).
3. Return ONLY the JSON object. No markdown, no triple backticks, no extra text.`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.1-70b-versatile",
      response_format: { type: "json_object" }
    });

    const responseText = chatCompletion.choices[0].message.content;
    res.json(JSON.parse(responseText));
  } catch (err) {
    console.error("Groq Error:", err);
    res.status(500).json({ error: "Failed to generate questions via Groq. Please verify your API key." });
  }
});
