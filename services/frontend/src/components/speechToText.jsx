import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, Square, Play, User, Book, Sparkles } from "lucide-react";
import { Video } from "./video.jsx";
import { useInterview } from "../hooks/useInterview";

export const SpeechToText = () => {
  const videoRef = useRef(null);
  const [topicInput, setTopicInput] = useState("");
  const {
    messages,
    isListening,
    isInterviewActive,
    inputSubmitted,
    isProcessing,
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
                <div className="aspect-square w-full mb-6 relative overflow-hidden bg-scholar-brown/5 flex items-center justify-center">
                  <motion.div 
                    animate={{ opacity: isProcessing ? [0.4, 0.7, 0.4] : 1 }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="text-scholar-brown-light/20"
                  >
                    <User size={120} strokeWidth={0.5} />
                  </motion.div>
                  {/* Subtle 'Sketchy' Overlay Placeholder */}
                  <div className="absolute inset-0 border-4 border-scholar-cream" />
                </div>
                <div className="text-center space-y-2">
                  <h3 className="text-xl uppercase tracking-wider">The Interlocutor</h3>
                  <p className="text-[10px] uppercase tracking-widest text-scholar-brown-light">Mentorship Phase</p>
                </div>
              </div>

              <div className="border-4 border-scholar-brown-light p-1 shadow-2xl bg-black aspect-video overflow-hidden">
                <Video ref={videoRef} />
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={endInterview}
                  className="w-full py-4 border border-scholar-terracotta text-scholar-terracotta uppercase tracking-widest text-[10px] hover:bg-scholar-terracotta hover:text-scholar-cream transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <Square size={12} /> Terminate Session
                </button>
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
                   <span className="text-[9px] uppercase tracking-[0.2em]">Live Audio Feed</span>
                </div>
              </div>

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
                {isProcessing && (
                  <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    className="flex items-center gap-2 text-scholar-brown/30 font-serif italic"
                  >
                    <Sparkles size={14} className="animate-spin" />
                    <span>The mentor is recording your thoughts...</span>
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
