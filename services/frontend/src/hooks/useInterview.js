import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { gemini, chat } from '../api/userApi';

export const useInterview = () => {
  const recognitionRef = useRef(null);
  const isInterviewActiveRef = useRef(false);
  const interviewTopicRef = useRef("");
  const questionsRef = useRef({});
  const questionPoolRef = useRef([]);
  const askingQuestionRef = useRef(false);
  const responseCapturedRef = useRef(false);
  const [isListening, setIsListening] = useState(false);
  const [isInterviewActive, setIsInterviewActive] = useState(false);
  const [messages, setMessages] = useState([]);
  const [interviewTopic, setInterviewTopic] = useState("");
  const [inputSubmitted, setInputSubmitted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  
  const resultsRef = useRef(new Set());
  const resultsUsedRef = useRef(new Set());
  const navigate = useNavigate();

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const normalizeQuestions = (data) => {
    const questions = [];

    const collectQuestions = (value) => {
      if (typeof value === "string") {
        questions.push(value);
        return;
      }

      if (Array.isArray(value)) {
        value.forEach(collectQuestions);
        return;
      }

      if (value && typeof value === "object") {
        Object.values(value).forEach(collectQuestions);
      }
    };

    collectQuestions(data);
    return [...new Set(questions.map((question) => question.trim()).filter(Boolean))];
  };

  const getNextQuestion = () => {
    if (resultsUsedRef.current.size === 0) {
      return "Introduce yourself, please";
    }

    if (resultsRef.current.size === 0) {
      questionPoolRef.current.forEach((question) => {
        if (!resultsUsedRef.current.has(question)) {
          resultsRef.current.add(question);
        }
      });
    }

    const nextQuestion = Array.from(resultsRef.current).shift();
    if (!nextQuestion) {
      return "Could you tell me more about your experience?";
    }

    resultsRef.current.delete(nextQuestion);
    return nextQuestion;
  };

  const readOut = (message) => {
    return new Promise((resolve) => {
      const speech = new SpeechSynthesisUtterance();
      speech.text = message;
      speech.volume = 1;
      speech.onerror = resolve;
      speech.onend = resolve;
      window.speechSynthesis.speak(speech);
    });
  };

  const askNextQuestion = async () => {
    if (!isInterviewActiveRef.current || askingQuestionRef.current) return;

    askingQuestionRef.current = true;
    setIsProcessing(true);

    const nextQuestion = getNextQuestion();
    resultsUsedRef.current.add(nextQuestion);
    responseCapturedRef.current = false;

    setMessages(prev => [...prev, { text: nextQuestion, type: "question" }]);

    try {
      await readOut(nextQuestion);
      await chat({
        topic: interviewTopicRef.current,
        interviewData: { text: nextQuestion, type: "question" },
      });

      if (isInterviewActiveRef.current && recognitionRef.current) {
        recognitionRef.current.start();
      }
    } catch (error) {
      console.error("Question delivery failed", error);
      setErrorMessage("The interviewer could not continue. Please try again.");
    } finally {
      askingQuestionRef.current = false;
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = async () => {
      setIsListening(true);
    };

    recognition.onerror = (event) => {
      setIsListening(false);
      if (event.error !== "no-speech") {
        setErrorMessage(`Speech recognition failed: ${event.error}`);
      }
    };

    recognition.onresult = async (event) => {
      const transcript = event.results[event.resultIndex][0].transcript.trim();
      if (!transcript) return;

      responseCapturedRef.current = true;
      
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
        Object.keys(questionsRef.current).forEach(topic => {
          if (topic.toLowerCase() === cleanWord) {
            questionsRef.current[topic].forEach(q => {
              if (!resultsUsedRef.current.has(q)) resultsRef.current.add(q);
            });
          }
        });
      });

      await chat({
        topic: interviewTopicRef.current,
        interviewData: { text: transcript, type: "response" },
      });
    };

    recognition.onend = () => {
      setIsListening(false);
      if (isInterviewActiveRef.current && responseCapturedRef.current) {
        window.setTimeout(askNextQuestion, 800);
      }
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.onstart = null;
      recognition.onerror = null;
      recognition.onresult = null;
      recognition.onend = null;
      recognitionRef.current = null;
    };
  }, []);

  const startInterview = async (topic) => {
    const trimmedTopic = topic.trim();
    setInterviewTopic(trimmedTopic);
    interviewTopicRef.current = trimmedTopic;
    setErrorMessage("");

    if (!recognitionRef.current) {
      setErrorMessage("Speech recognition is not available in this browser.");
      return;
    }

    try {
      setIsProcessing(true);
      const qData = await gemini({ body: trimmedTopic });
      if (!qData || Array.isArray(qData) || Object.keys(qData).length === 0) {
        throw new Error("The interview service returned no questions. Please try again.");
      }

      resultsRef.current.clear();
      resultsUsedRef.current.clear();
      questionsRef.current = qData;
      questionPoolRef.current = normalizeQuestions(qData);
      if (questionPoolRef.current.length === 0) {
        throw new Error("The interview service returned no usable questions. Please try again.");
      }

      setInputSubmitted(true);
      setIsInterviewActive(true);
      isInterviewActiveRef.current = true;
      await delay(300);
      await askNextQuestion();
    } catch (error) {
      console.error("Gemini failed", error);
      setErrorMessage(error.message || "Failed to start the interview. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const endInterview = async () => {
    setIsInterviewActive(false);
    isInterviewActiveRef.current = false;
    window.speechSynthesis.cancel();
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    await delay(500);
    navigate("/results");
  };

  return {
    messages,
    isListening,
    isInterviewActive,
    inputSubmitted,
    isProcessing,
    errorMessage,
    startInterview,
    endInterview,
    interviewTopic
  };
};
