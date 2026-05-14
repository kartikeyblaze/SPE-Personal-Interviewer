import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, Square, Play, Book, Sparkles, CheckCircle2 } from "lucide-react";
import { Video } from "./video.jsx";
import { useInterview } from "../hooks/useInterview";

export const SpeechToText = () => {
  const videoRef = useRef(null);
  const [topicInput, setTopicInput] = useState("");
  const {
    messages,
    isListening,
    isInterviewActive,
    isAnswering,
    inputSubmitted,
    isProcessing,
    isEvaluating,
    questionCount,
    answerCount,
    canEndInterview,
    errorMessage,
    startAnswer,
    finishAnswer,
    startInterview,
    endInterview,
    interviewTopic
  } = useInterview();

  const handleStart = (e) => {
    e.preventDefault();
    if (topicInput.trim()) {
      startInterview(topicInput);
    }
  };

  return (
    <main className="min-h-[calc(100vh-120px)] flex flex-col items-center py-12 px-6">
      <AnimatePresence mode="wait">
        {!inputSubmitted ? (
          <motion.div
            key="input-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-xl bg-scholar-cream p-12 border border-scholar-brown/10 shadow-xl relative"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-scholar-green/30" />
            <h2 className="text-3xl mb-8 text-center tracking-tight">The Examination Entry</h2>
            <form onSubmit={handleStart} className="space-y-8">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.3em] text-scholar-brown-light block">
                  Subject of Inquiry
                </label>
                <input
                  type="text"
                  value={topicInput}
                  onChange={(e) => setTopicInput(e.target.value)}
                  placeholder="e.g., Software Engineering Principles"
                  className="w-full bg-transparent border-b border-scholar-brown/20 py-4 focus:border-scholar-green outline-none transition-colors font-serif italic text-lg"
                />
              </div>
              <button
                type="submit"
                disabled={!topicInput.trim() || isProcessing}
                className="w-full py-4 bg-scholar-brown text-scholar-cream uppercase tracking-widest text-xs hover:bg-scholar-green transition-all duration-500 disabled:opacity-30 flex items-center justify-center gap-3"
              >
                {isProcessing ? <Sparkles className="animate-pulse" size={16} /> : <Play size={16} />}
                Commence Interview
              </button>
              {errorMessage && (
                <p className="text-sm text-scholar-terracotta leading-relaxed" role="alert">
                  {errorMessage}
                </p>
              )}
            </form>
          </motion.div>
        ) : (
          <motion.div
            key="interview-section"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-12"
          >
            {/* Left: Mentor Persona & Video */}
            <div className="lg:col-span-4 space-y-8">
              <div className="bg-scholar-cream p-8 border border-scholar-brown/10 shadow-md">
                <div className="aspect-square w-full mb-6 relative overflow-hidden bg-[#d8c8aa] flex items-center justify-center">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(255,255,255,0.45),transparent_42%)]" />
                  <motion.div
                    animate={isProcessing ? { y: [0, -3, 0] } : { y: 0 }}
                    transition={{ repeat: isProcessing ? Infinity : 0, duration: 1.4 }}
                    className="relative w-44 h-56"
                  >
                    <div className="absolute left-1/2 top-6 h-36 w-32 -translate-x-1/2 rounded-[48%_48%_44%_44%] bg-[#b88761] shadow-inner" />
                    <div className="absolute left-1/2 top-16 h-32 w-28 -translate-x-1/2 rounded-[48%] bg-[#e0b083]" />
                    <div className="absolute left-[45px] top-[86px] h-3 w-3 rounded-full bg-scholar-brown" />
                    <div className="absolute right-[45px] top-[86px] h-3 w-3 rounded-full bg-scholar-brown" />
                    <div className="absolute left-1/2 top-[108px] h-5 w-2 -translate-x-1/2 rounded-full bg-[#bd805c]" />
                    <motion.div
                      animate={isProcessing ? { height: [4, 12, 4] } : { height: 5 }}
                      transition={{ repeat: isProcessing ? Infinity : 0, duration: 0.45 }}
                      className="absolute left-1/2 top-[134px] w-10 -translate-x-1/2 rounded-full bg-scholar-brown"
                    />
                    <div className="absolute left-1/2 top-[162px] h-20 w-36 -translate-x-1/2 rounded-t-[48px] bg-scholar-brown" />
                    <div className="absolute left-1/2 top-[174px] h-16 w-24 -translate-x-1/2 rounded-t-[38px] bg-scholar-green/70" />
                  </motion.div>
                  <div className="absolute inset-0 border-4 border-scholar-cream" />
                </div>
                <div className="text-center space-y-2">
                  <h3 className="text-xl uppercase tracking-wider">The Interlocutor</h3>
                  <p className="text-[10px] uppercase tracking-widest text-scholar-brown-light">Mentorship Phase</p>
                </div>
              </div>

              <div className="border-4 border-scholar-brown-light p-1 shadow-2xl bg-black aspect-video overflow-hidden">
                <Video ref={videoRef} isActive={isInterviewActive} />
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={startAnswer}
                  disabled={isAnswering || isProcessing || isEvaluating}
                  className="w-full py-4 bg-scholar-green text-scholar-cream uppercase tracking-widest text-[10px] hover:bg-scholar-brown transition-all duration-300 disabled:opacity-30 flex items-center justify-center gap-2"
                >
                  <Mic size={12} /> Answer
                </button>
                <button
                  onClick={finishAnswer}
                  disabled={!isAnswering || isProcessing || isEvaluating}
                  className="w-full py-4 border border-scholar-green text-scholar-green uppercase tracking-widest text-[10px] hover:bg-scholar-green hover:text-scholar-cream transition-all duration-300 disabled:opacity-30 flex items-center justify-center gap-2"
                >
                  <CheckCircle2 size={12} /> Finish Answer
                </button>
                <button
                  onClick={endInterview}
                  disabled={!canEndInterview || isAnswering || isProcessing || isEvaluating}
                  className="w-full py-4 border border-scholar-terracotta text-scholar-terracotta uppercase tracking-widest text-[10px] hover:bg-scholar-terracotta hover:text-scholar-cream transition-all duration-300 disabled:opacity-30 flex items-center justify-center gap-2"
                >
                  <Square size={12} /> {isEvaluating ? "Evaluating Session" : "Terminate Session"}
                </button>
                <p className="text-center text-[9px] uppercase tracking-widest text-scholar-brown-light/60">
                  {answerCount}/6 answers completed
                </p>
              </div>
            </div>

            {/* Right: The Ledger (Chat) */}
            <div className="lg:col-span-8 bg-scholar-cream border border-scholar-brown/10 shadow-2xl flex flex-col h-[700px] relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-scholar-brown/5" />
              
              <div className="p-8 border-b border-scholar-brown/5 flex justify-between items-center bg-scholar-cream/80 backdrop-blur-sm z-10">
                <div className="flex items-center gap-4">
                  <Book size={20} className="text-scholar-brown-light" />
                  <div>
                    <h3 className="font-serif italic text-lg">{interviewTopic}</h3>
                    <p className="text-[9px] uppercase tracking-widest opacity-50">Transcribed in Real-time</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                   <motion.div
                    animate={isListening ? { scale: [1, 1.2, 1] } : {}}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className={`w-3 h-3 rounded-full ${isListening ? 'bg-scholar-green' : 'bg-scholar-brown/20'}`}
                   />
                   <span className="text-[9px] uppercase tracking-[0.2em]">
                    {isAnswering ? "Recording Answer" : "Awaiting Scholar"}
                   </span>
                   <span className="text-[9px] uppercase tracking-[0.2em] text-scholar-brown-light/50">
                    Q{questionCount}
                   </span>
                </div>
              </div>
              {errorMessage && (
                <div className="px-8 py-3 border-b border-scholar-terracotta/20 bg-scholar-terracotta/10 text-sm text-scholar-terracotta" role="alert">
                  {errorMessage}
                </div>
              )}

              <div className="flex-1 overflow-y-auto p-12 space-y-12 scrollbar-thin scrollbar-thumb-scholar-brown/10">
                <AnimatePresence initial={false}>
                  {messages.map((msg, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: msg.type === 'question' ? -10 : 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`flex flex-col ${msg.type === 'question' ? 'items-start' : 'items-end'}`}
                    >
                      <span className="text-[8px] uppercase tracking-[0.3em] mb-2 opacity-40">
                        {msg.type === 'question' ? 'Inquiry' : 'Response'}
                      </span>
                      <div className={`max-w-[85%] ${
                        msg.type === 'question' 
                        ? 'font-serif text-xl text-scholar-brown leading-relaxed border-l-2 border-scholar-green/20 pl-6' 
                        : 'font-handwritten text-2xl text-scholar-brown-light pr-6 text-right italic'
                      }`}>
                        {msg.text}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {(isProcessing || isEvaluating) && (
                  <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    className="flex items-center gap-2 text-scholar-brown/30 font-serif italic"
                  >
                    <Sparkles size={14} className="animate-spin" />
                    <span>{isEvaluating ? "The mentor is evaluating the session..." : "The mentor is preparing the next inquiry..."}</span>
                  </motion.div>
                )}
              </div>
              
              <div className="p-8 border-t border-scholar-brown/5 bg-scholar-cream/50">
                <div className="flex items-center justify-center gap-6">
                  <div className="flex items-center gap-4 text-scholar-brown/40">
                    <Mic size={18} />
                    <div className="w-32 h-1 bg-scholar-brown/10 rounded-full overflow-hidden">
                      <motion.div 
                        animate={isListening ? { x: [-128, 0] } : {}}
                        transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                        className="w-full h-full bg-scholar-green/40" 
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
};
