import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { gemini, chat } from '../api/userApi';

export const useInterview = () => {
  const recognitionRef = useRef(null);
  const [isListening, setIsListening] = useState(false);
  const [isInterviewActive, setIsInterviewActive] = useState(false);
  const [messages, setMessages] = useState([]);
  const [questions, setQuestions] = useState({});
  const [interviewTopic, setInterviewTopic] = useState("");
  const [inputSubmitted, setInputSubmitted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const resultsRef = useRef(new Set());
  const resultsUsedRef = useRef(new Set());
  const navigate = useNavigate();

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const readOut = (message) => {
    return new Promise((resolve) => {
      const speech = new SpeechSynthesisUtterance();
      speech.text = message;
      speech.volume = 1;
      speech.onend = resolve;
      window.speechSynthesis.speak(speech);
    });
  };

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;

    let firstVisit = true;

    recognition.onstart = async () => {
      setIsListening(true);
      let nextQuestion = "";

      if (firstVisit) {
        await delay(1000);
        nextQuestion = "Introduce yourself, please";
        firstVisit = false;
      } else if (resultsRef.current.size > 0) {
        nextQuestion = Array.from(resultsRef.current).shift();
        resultsUsedRef.current.add(nextQuestion);
        resultsRef.current.delete(nextQuestion);
      } else {
        const topics = Object.keys(questions);
        if (topics.length > 0) {
          const randomTopic = topics[Math.floor(Math.random() * topics.length)];
          const topicQuestions = questions[randomTopic];
          topicQuestions.forEach(q => {
            if (!resultsUsedRef.current.has(q)) resultsRef.current.add(q);
          });
          nextQuestion = Array.from(resultsRef.current).shift() || "Could you tell me more about your experience?";
          resultsUsedRef.current.add(nextQuestion);
          resultsRef.current.delete(nextQuestion);
        }
      }

      setMessages(prev => [...prev, { text: nextQuestion, type: "question" }]);
      setIsProcessing(true);
      await readOut(nextQuestion);
      setIsProcessing(false);

      await chat({
        topic: interviewTopic,
        interviewData: { text: nextQuestion, type: "question" },
      });
    };

    recognition.onresult = (event) => {
      const transcript = event.results[event.resultIndex][0].transcript.trim();
      
      setMessages(prev => {
        const last = prev[prev.length - 1];
        if (last && last.type === "response") {
          return [...prev.slice(0, -1), { text: last.text + " " + transcript, type: "response" }];
        }
        return [...prev, { text: transcript, type: "response" }];
      });

      transcript.split(" ").forEach(word => {
        const cleanWord = word.replace(/[.,]/g, "").toLowerCase();
        // Check topic match
        Object.keys(questions).forEach(topic => {
          if (topic.toLowerCase() === cleanWord) {
            questions[topic].forEach(q => {
              if (!resultsUsedRef.current.has(q)) resultsRef.current.add(q);
            });
          }
        });
      });
    };

    recognition.onend = () => {
      setIsListening(false);
      if (isInterviewActive) {
        recognition.start();
      }
    };

    recognitionRef.current = recognition;
  }, [isInterviewActive, questions, interviewTopic]);

  const startInterview = async (topic) => {
    setInterviewTopic(topic);
    try {
      setIsProcessing(true);
      const qData = await gemini({ body: topic });
      setQuestions(qData);
      setInputSubmitted(true);
      setIsInterviewActive(true);
      recognitionRef.current.start();
      setIsProcessing(false);
    } catch (error) {
      console.error("Gemini failed", error);
      setIsProcessing(false);
    }
  };

  const endInterview = async () => {
    setIsInterviewActive(false);
    recognitionRef.current.stop();
    await delay(500);
    navigate("/results");
  };

  return {
    messages,
    isListening,
    isInterviewActive,
    inputSubmitted,
    isProcessing,
    startInterview,
    endInterview,
    interviewTopic
  };
};
