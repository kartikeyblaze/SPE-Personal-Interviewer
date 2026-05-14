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

const GROQ_MODEL = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";
const configuredGroqTimeout = Number(process.env.GROQ_TIMEOUT_MS);
const GROQ_TIMEOUT_MS = Number.isFinite(configuredGroqTimeout) ? configuredGroqTimeout : 30000;
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
  timeout: GROQ_TIMEOUT_MS,
});

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
    const userInterviews = await Interview.find({ user }, 'topic interviewData evaluation');
    // Return empty array instead of 404 for new users
    res.json(userInterviews || []);
  } catch (error) {
    console.error("Results fetch error:", error);
    res.status(500).json({ message: error.message });
  }
});

const buildInterviewPairs = (interviewData = []) => {
  const pairs = [];
  let currentQuestion = null;

  interviewData.forEach((item) => {
    if (!item || !item.text) return;

    if (item.type === "question") {
      currentQuestion = item.text;
      return;
    }

    if (item.type === "response" && currentQuestion) {
      pairs.push({
        question: currentQuestion,
        answer: item.text,
      });
      currentQuestion = null;
    }
  });

  return pairs;
};

app.post("/api/interview/evaluate", protect, async (req, res) => {
  try {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey || apiKey === "no_key_provided") {
      return res.status(500).json({ error: "Groq API key not configured." });
    }

    const user = req.email;
    const topic = typeof req.body.topic === "string" ? req.body.topic.trim() : "";
    if (!topic) {
      return res.status(400).json({ error: "Interview topic is required." });
    }

    const interview = await Interview.findOne({ user, topic }).sort({ date: -1 });
    if (!interview) {
      return res.status(404).json({ error: "Interview transcript not found." });
    }

    const pairs = buildInterviewPairs(interview.interviewData);
    if (pairs.length === 0) {
      return res.status(400).json({ error: "No completed question-answer pairs found." });
    }

    const prompt = `Evaluate this mock interview for topic "${topic}".
Return ONLY a JSON object in this exact shape:
{
  "mentorComments": [
    {
      "question": "Question text",
      "answer": "Answer text",
      "comment": "Specific mentor feedback",
      "score": 1
    }
  ],
  "overallReview": "Overall review paragraph"
}

Scoring rules:
1. score is an integer from 1 to 5.
2. Give one mentorComments item for each question-answer pair.
3. Comments should be concise, practical, and specific.
4. Do not use markdown.

Question-answer pairs:
${JSON.stringify(pairs, null, 2)}`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: GROQ_MODEL,
      response_format: { type: "json_object" }
    });

    const responseText = chatCompletion.choices[0].message.content;
    const evaluation = JSON.parse(responseText);

    interview.evaluation = {
      mentorComments: Array.isArray(evaluation.mentorComments) ? evaluation.mentorComments : [],
      overallReview: typeof evaluation.overallReview === "string" ? evaluation.overallReview : "",
    };
    await interview.save();

    res.json(interview.evaluation);
  } catch (err) {
    console.error("Evaluation Error:", err);
    const isTimeout = err.name === "APIConnectionTimeoutError" || err.code === "ETIMEDOUT";
    const status = isTimeout ? 504 : err.status || 500;
    const message = isTimeout
      ? "Groq evaluation request timed out. Please try again."
      : err.error?.message || err.message || "Failed to evaluate interview.";

    res.status(status).json({ error: message });
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

    const topic = typeof req.body.body === "string" ? req.body.body.trim() : "";
    if (!topic) {
      return res.status(400).json({ error: "Interview topic is required." });
    }

    const prompt = `Generate interview questions for the topic: "${topic}".
Return a JSON object EXACTLY in this format, with at least 5 different sub-topic keys:
{
  "Sub-topic 1": [
    "Question 1?",
    "Question 2?",
    "Question 3?"
  ],
  "Sub-topic 2": [
    "Question 1?",
    "Question 2?",
    "Question 3?"
  ]
}
Requirements:
1. Include at least 5 sub-topics as top-level object keys.
2. Provide exactly 3 questions per sub-topic: Easy, Medium, Hard.
3. Return at least 15 total questions.
4. Return ONLY the JSON object. No markdown, no triple backticks, no extra text.`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: GROQ_MODEL,
      response_format: { type: "json_object" }
    });

    const responseText = chatCompletion.choices[0].message.content;
    res.json(JSON.parse(responseText));
  } catch (err) {
    console.error("Groq Error:", err);
    const isTimeout = err.name === "APIConnectionTimeoutError" || err.code === "ETIMEDOUT";
    const status = isTimeout ? 504 : err.status || 500;
    const message = isTimeout
      ? "Groq request timed out. Please try again."
      : err.error?.message || err.message || "Failed to generate questions via Groq.";

    res.status(status).json({ error: message });
  }
});
