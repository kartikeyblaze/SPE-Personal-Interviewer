import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { BookOpen, Award, Sparkles, ArrowRight, ScrollText } from "lucide-react";
import { UserContext } from "../useContext";

export const Home = () => {
  const { user } = useContext(UserContext);
  const isLoggedIn = !!localStorage.getItem("loggedinuser");

  return (
    <div className="min-h-[calc(100vh-120px)] flex flex-col items-center py-20 px-6">
      <div className="max-w-4xl w-full text-center space-y-12">
        {/* Decorative Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 px-4 py-2 border border-scholar-brown/20 bg-scholar-cream/50 rounded-full text-[10px] uppercase tracking-[0.3em] text-scholar-brown-light"
        >
          <Sparkles size={14} className="text-scholar-green" /> Established MMXXVI
        </motion.div>

        {/* Hero Section */}
        <div className="space-y-6">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-7xl font-serif text-scholar-brown leading-tight tracking-tight"
          >
            Refine your <span className="italic">intellect</span> through <span className="text-scholar-green">mentorship</span>.
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-scholar-brown-light opacity-70 max-w-2xl mx-auto leading-relaxed"
          >
            A classical environment designed for the modern professional. Engage in rigorous interview simulations guided by generative intelligence.
          </motion.p>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12">
          <FeatureCard 
            icon={<BookOpen size={32} strokeWidth={1} />}
            title="Curriculum"
            desc="AI-generated inquiry based on any subject of your choosing."
            delay={0.3}
          />
          <FeatureCard 
            icon={<ScrollText size={32} strokeWidth={1} />}
            title="Transcripts"
            desc="Review your sessions with formal academic manuscripts."
            delay={0.4}
          />
          <FeatureCard 
            icon={<Award size={32} strokeWidth={1} />}
            title="Validation"
            desc="Refine your rhetoric and receive formal evaluations."
            delay={0.5}
          />
        </div>

        {/* Primary Call to Action */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="pt-16"
        >
          {isLoggedIn ? (
            <Link 
              to="/speechToText" 
              className="group inline-flex items-center gap-4 bg-scholar-brown text-scholar-cream px-10 py-5 uppercase tracking-[0.2em] text-xs hover:bg-scholar-green transition-all duration-500 shadow-2xl"
            >
              Enter the Study <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
            </Link>
          ) : (
            <Link 
              to="/login" 
              className="group inline-flex items-center gap-4 bg-scholar-brown text-scholar-cream px-10 py-5 uppercase tracking-[0.2em] text-xs hover:bg-scholar-green transition-all duration-500 shadow-2xl"
            >
              Begin Your Enrollment <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
            </Link>
          )}
        </motion.div>
      </div>

      {/* Decorative Pencil Sketch Placeholder Overlay */}
      <div className="fixed bottom-0 right-0 p-12 opacity-5 pointer-events-none hidden lg:block">
        <BookOpen size={400} strokeWidth={0.5} />
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="p-8 border border-scholar-brown/10 bg-scholar-cream hover:shadow-xl transition-all duration-500 group text-center"
  >
    <div className="mb-6 text-scholar-brown-light group-hover:text-scholar-green transition-colors flex justify-center">
      {icon}
    </div>
    <h3 className="text-xl font-serif italic mb-3 text-scholar-brown">{title}</h3>
    <p className="text-xs text-scholar-brown-light opacity-60 leading-relaxed font-sans uppercase tracking-widest">{desc}</p>
  </motion.div>
);
