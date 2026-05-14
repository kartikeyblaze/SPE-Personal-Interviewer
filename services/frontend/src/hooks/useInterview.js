import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { evaluateInterview, gemini, chat } from '../api/userApi';

const MIN_ANSWERS_BEFORE_END = 6;

export const useInterview = () => {
  const recognitionRef = useRef(null);
  const isInterviewActiveRef = useRef(false);
  const interviewTopicRef = useRef("");
  const questionsRef = useRef({});
  const questionPoolRef = useRef([]);
  const askingQuestionRef = useRef(false);
  const isAnsweringRef = useRef(false);
  const answerDraftRef = useRef("");
  const [isListening, setIsListening] = useState(false);
  const [isInterviewActive, setIsInterviewActive] = useState(false);
  const [isAnswering, setIsAnswering] = useState(false);
  const [messages, setMessages] = useState([]);
  const [interviewTopic, setInterviewTopic] = useState("");
  const [inputSubmitted, setInputSubmitted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [questionCount, setQuestionCount] = useState(0);
  const [answerCount, setAnswerCount] = useState(0);
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
    answerDraftRef.current = "";

    setMessages(prev => [...prev, { text: nextQuestion, type: "question" }]);
    setQuestionCount(prev => prev + 1);

    try {
      await readOut(nextQuestion);
      await chat({
        topic: interviewTopicRef.current,
        interviewData: { text: nextQuestion, type: "question" },
      });
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
    recognition.continuous = true;
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

      answerDraftRef.current = [answerDraftRef.current, transcript].filter(Boolean).join(" ");
      
      setMessages(prev => {
        const last = prev[prev.length - 1];
        if (last && last.type === "response") {
          return [...prev.slice(0, -1), { text: answerDraftRef.current, type: "response" }];
        }
        return [...prev, { text: answerDraftRef.current, type: "response" }];
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

    };

    recognition.onend = () => {
      setIsListening(false);
      if (isInterviewActiveRef.current && isAnsweringRef.current) {
        window.setTimeout(() => {
          if (isInterviewActiveRef.current && isAnsweringRef.current && recognitionRef.current) {
            recognitionRef.current.start();
          }
        }, 250);
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
      answerDraftRef.current = "";
      questionsRef.current = qData;
      questionPoolRef.current = normalizeQuestions(qData);
      if (questionPoolRef.current.length === 0) {
        throw new Error("The interview service returned no usable questions. Please try again.");
      }

      setInputSubmitted(true);
      setIsInterviewActive(true);
      setIsAnswering(false);
      setQuestionCount(0);
      setAnswerCount(0);
      isInterviewActiveRef.current = true;
      isAnsweringRef.current = false;
      await delay(300);
      await askNextQuestion();
    } catch (error) {
      console.error("Gemini failed", error);
      setErrorMessage(error.message || "Failed to start the interview. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const startAnswer = () => {
    if (!isInterviewActiveRef.current || isProcessing || isAnsweringRef.current) return;

    setErrorMessage("");
    answerDraftRef.current = "";
    isAnsweringRef.current = true;
    setIsAnswering(true);

    try {
      recognitionRef.current?.start();
    } catch (error) {
      console.error("Speech recognition start failed", error);
    }
  };

  const finishAnswer = async () => {
    if (!isInterviewActiveRef.current || !isAnsweringRef.current) return;

    isAnsweringRef.current = false;
    setIsAnswering(false);
    recognitionRef.current?.stop();

    const finalAnswer = answerDraftRef.current.trim();
    if (!finalAnswer) {
      setErrorMessage("No answer was captured. Press Answer and speak before finishing.");
      return;
    }

    setIsProcessing(true);
    try {
      await chat({
        topic: interviewTopicRef.current,
        interviewData: { text: finalAnswer, type: "response" },
      });
      setAnswerCount(prev => prev + 1);

      await delay(500);
      await askNextQuestion();
    } catch (error) {
      console.error("Answer save failed", error);
      setErrorMessage("Your answer was captured but could not be saved.");
    } finally {
      setIsProcessing(false);
    }
  };

  const endInterview = async () => {
    if (answerCount < MIN_ANSWERS_BEFORE_END) {
      setErrorMessage(`Please complete at least ${MIN_ANSWERS_BEFORE_END} answers before ending the interview.`);
      return;
    }

    setIsInterviewActive(false);
    isInterviewActiveRef.current = false;
    isAnsweringRef.current = false;
    setIsAnswering(false);
    window.speechSynthesis.cancel();
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }

    setIsEvaluating(true);
    try {
      await evaluateInterview({ topic: interviewTopicRef.current });
    } catch (error) {
      console.error("Evaluation failed", error);
    } finally {
      setIsEvaluating(false);
    }

    await delay(500);
    navigate("/results");
  };

  return {
    messages,
    isListening,
    isInterviewActive,
    isAnswering,
    inputSubmitted,
    isProcessing,
    isEvaluating,
    questionCount,
    answerCount,
    canEndInterview: answerCount >= MIN_ANSWERS_BEFORE_END,
    errorMessage,
    startAnswer,
    finishAnswer,
    startInterview,
    endInterview,
    interviewTopic
  };
};
