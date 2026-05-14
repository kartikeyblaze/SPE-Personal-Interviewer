import React from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FileText, ArrowLeft, Download, Award } from "lucide-react";

export const ResultsData = () => {
  const { id } = useParams();
  const location = useLocation();
  const topicData = location.state?.topic;
  const messages = topicData?.interviewData || [];
  const evaluation = topicData?.evaluation || {};
  const mentorComments = Array.isArray(evaluation.mentorComments) ? evaluation.mentorComments : [];

  const transcriptRows = [];
  let currentQuestion = null;

  messages.forEach((msg) => {
    if (!msg || !msg.text) return;

    if (msg.type === "question") {
      currentQuestion = msg.text;
      return;
    }

    if (msg.type === "response" && currentQuestion) {
      transcriptRows.push({
        question: currentQuestion,
        answer: msg.text,
      });
      currentQuestion = null;
    }
  });

  return (
    <div className="min-h-[calc(100vh-120px)] py-12 px-6 max-w-4xl mx-auto">
      <div className="mb-12 flex justify-between items-center">
        <Link 
          to="/results" 
          className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-scholar-brown-light hover:text-scholar-green transition-colors"
        >
          <ArrowLeft size={14} /> Back to Archives
        </Link>
        <button className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-scholar-brown-light hover:text-scholar-green transition-colors">
          <Download size={14} /> Download Manuscript
        </button>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-scholar-cream p-12 md:p-20 border border-scholar-brown/10 shadow-2xl relative overflow-hidden"
      >
        {/* Background Decorative Element */}
        <div className="absolute top-0 right-0 p-12 opacity-[0.02] rotate-12">
          <FileText size={400} />
        </div>

        {/* Header Seal */}
        <div className="absolute top-12 right-12 flex flex-col items-center gap-2 opacity-80">
          <div className="w-16 h-16 border-4 border-double border-scholar-green rounded-full flex items-center justify-center text-scholar-green rotate-12">
            <Award size={32} />
          </div>
          <span className="text-[8px] uppercase tracking-tighter text-scholar-green font-bold rotate-12">Official Record</span>
        </div>

        <div className="relative z-10">
          <header className="mb-16 border-b border-scholar-brown/10 pb-12">
            <h2 className="text-[10px] uppercase tracking-[0.5em] text-scholar-brown-light opacity-60 mb-4">Official Transcript</h2>
            <h1 className="text-5xl font-serif italic text-scholar-brown mb-6">{id}</h1>
            <div className="flex flex-wrap gap-8 text-[10px] uppercase tracking-widest text-scholar-brown-light">
              <div>
                <span className="opacity-40">Status:</span> <span className="text-scholar-green">Evaluated</span>
              </div>
              <div>
                <span className="opacity-40">Session ID:</span> <span>#SCR-{Math.floor(Math.random() * 9000) + 1000}</span>
              </div>
            </div>
          </header>

          <div className="space-y-12">
            {transcriptRows.map((row, index) => {
              const feedback = mentorComments[index] || {};

              return (
              <motion.div 
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="border-b border-scholar-brown/10 pb-10 last:border-b-0"
              >
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-6">
                  <div className="md:col-span-3">
                    <span className="text-[9px] uppercase tracking-[0.3em] font-bold text-scholar-brown">
                      Question {index + 1}
                    </span>
                  </div>
                  <div className="md:col-span-9">
                    <p className="font-serif text-lg text-scholar-brown leading-relaxed italic">
                      {typeof row.question === "string" ? row.question : JSON.stringify(row.question)}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-6">
                  <div className="md:col-span-3">
                    <span className="text-[9px] uppercase tracking-[0.3em] font-bold text-scholar-green">
                      Your Answer
                    </span>
                  </div>
                  <div className="md:col-span-9">
                    <p className="font-handwritten text-2xl text-scholar-brown-light leading-snug">
                      {typeof row.answer === "string" ? row.answer : JSON.stringify(row.answer)}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  <div className="md:col-span-3">
                    <span className="text-[9px] uppercase tracking-[0.3em] font-bold text-scholar-terracotta">
                      Mentor's Comments
                    </span>
                  </div>
                  <div className="md:col-span-9">
                    <p className="text-sm text-scholar-brown-light leading-relaxed">
                      {feedback.comment || "No mentor comment available for this answer."}
                    </p>
                    {feedback.score && (
                      <p className="mt-3 text-[9px] uppercase tracking-widest text-scholar-brown-light/60">
                        Score: {feedback.score}/5
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
              );
            })}
          </div>

          <section className="mt-20 border-t border-scholar-brown/10 pt-12">
            <h3 className="text-[10px] uppercase tracking-[0.4em] text-scholar-brown-light opacity-60 mb-6">Overall Review</h3>
            <p className="font-serif text-xl italic leading-relaxed text-scholar-brown">
              {evaluation.overallReview || "No overall review has been generated for this session yet."}
            </p>
          </section>

          <footer className="mt-24 pt-12 border-t border-scholar-brown/10 flex flex-col items-center">
             <div className="font-serif italic text-scholar-brown/30 text-sm mb-4 italic">
               End of Transcript
             </div>
             <div className="w-32 h-[1px] bg-scholar-brown/20" />
          </footer>
        </div>
      </motion.div>
    </div>
  );
};
