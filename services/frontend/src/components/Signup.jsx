import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { registerUser } from "../api/userApi";
import { UserPlus, User, Mail, Lock, ShieldCheck } from "lucide-react";

export const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.password.length < 8) {
        window.alert("Cipher must be at least 8 characters in length.");
        return;
      }
      const response = await registerUser(formData);
      alert("Enrollment Successful. Please proceed to verification.");
      navigate("/login");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="min-h-[calc(100vh-120px)] flex items-center justify-center py-12 px-6">
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="w-full max-w-lg bg-scholar-cream p-12 border border-scholar-brown/10 shadow-2xl relative"
      >
        <div className="absolute top-0 right-0 w-1/3 h-1 bg-scholar-green/40" />
        
        <div className="text-center mb-12">
          <h2 className="text-4xl font-serif mb-2 tracking-tight">Academic Enrollment</h2>
          <p className="text-[10px] uppercase tracking-[0.3em] text-scholar-brown-light opacity-60">Scholar Registry</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-2">
            <label className="text-[9px] uppercase tracking-widest text-scholar-brown-light flex items-center gap-2">
              <User size={12} /> Full Name / Pseudonym
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Leonardo da Vinci"
              className="w-full bg-transparent border-b border-scholar-brown/20 py-3 focus:border-scholar-green outline-none transition-colors font-serif italic text-lg"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-[9px] uppercase tracking-widest text-scholar-brown-light flex items-center gap-2">
              <Mail size={12} /> Institutional Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="scholar@university.edu"
              className="w-full bg-transparent border-b border-scholar-brown/20 py-3 focus:border-scholar-green outline-none transition-colors font-serif italic text-lg"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-[9px] uppercase tracking-widest text-scholar-brown-light flex items-center gap-2">
              <Lock size={12} /> Secure Cipher
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full bg-transparent border-b border-scholar-brown/20 py-3 focus:border-scholar-green outline-none transition-colors font-serif italic text-lg"
              required
            />
          </div>

          <div className="p-4 bg-scholar-green/5 border border-scholar-green/10 flex items-start gap-3 italic text-[10px] text-scholar-green">
            <ShieldCheck size={16} className="shrink-0" />
            <p>By enrolling, you agree to uphold the standards of the Scholar's Study and provide honest responses during sessions.</p>
          </div>

          <button 
            type="submit" 
            className="w-full py-4 bg-scholar-brown text-scholar-cream uppercase tracking-widest text-xs hover:bg-scholar-green transition-all duration-500 flex items-center justify-center gap-3 shadow-lg"
          >
            <UserPlus size={16} /> Register Enrollment
          </button>
        </form>

        <div className="mt-12 pt-8 border-t border-scholar-brown/5 text-center">
          <p className="text-xs text-scholar-brown-light opacity-60 font-sans tracking-wide">
            Already registered? 
            <Link to="/login" className="ml-2 text-scholar-green hover:underline decoration-1 underline-offset-4">Access Ledger</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;
