import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Award, BookOpen, ChevronRight, FileText } from "lucide-react";
import { results } from "../api/userApi.jsx";

export const Results = () => {
  const [topics, setTopics] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const fetchedTopics = await results();
        setTopics(Array.isArray(fetchedTopics) ? fetchedTopics : []);
      } catch (error) {
        console.error("Error fetching archives:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchResults();
  }, []);

  return (
    <div className="min-h-[calc(100vh-120px)] py-16 px-6 max-w-5xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl font-serif mb-4 tracking-tight text-scholar-brown">Academic Archives</h2>
        <div className="w-24 h-1 bg-scholar-brown/10 mx-auto mb-4" />
        <p className="text-[10px] uppercase tracking-[0.4em] text-scholar-brown-light opacity-60">Session Transcripts & Evaluations</p>
      </motion.div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20 italic text-scholar-brown/40 font-serif">
          Retrieving manuscripts...
        </div>
      ) : topics.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {topics.map((topic, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="group bg-scholar-cream p-8 border border-scholar-brown/10 shadow-lg hover:shadow-2xl transition-all duration-500 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 transition-opacity">
                <FileText size={80} strokeWidth={1} />
              </div>
              
              <div className="flex justify-between items-start mb-6">
                <div className="p-3 bg-scholar-brown/5 text-scholar-brown-light rounded-sm">
                  <BookOpen size={24} strokeWidth={1.5} />
                </div>
                <div className="flex items-center gap-1 text-scholar-green">
                  <Award size={16} />
                  <span className="text-[8px] uppercase tracking-widest font-bold italic">Validated</span>
                </div>
              </div>

              <h3 className="text-2xl font-serif italic mb-2 text-scholar-brown group-hover:text-scholar-green transition-colors">
                {topic.topic}
              </h3>
              <p className="text-[9px] uppercase tracking-widest text-scholar-brown-light opacity-60 mb-8">
                Official Transcript #{index + 101}
              </p>

              <Link
                to={`/results/${topic.topic}`}
                state={{ topic }}
                className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-sans border-b border-scholar-brown/20 pb-1 hover:border-scholar-green hover:text-scholar-green transition-all"
              >
                Examine Transcript <ChevronRight size={14} />
              </Link>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 border border-dashed border-scholar-brown/20 bg-scholar-brown/5">
          <p className="font-serif italic text-scholar-brown/40">No transcripts found in the archives.</p>
          <Link to="/speechToText" className="mt-4 inline-block text-[10px] uppercase tracking-widest text-scholar-green hover:underline">Commence First Session</Link>
        </div>
      )}
    </div>
  );
};
