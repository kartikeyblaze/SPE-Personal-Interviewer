import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserContext } from "../useContext.jsx";
import { loginUser } from '../api/userApi';
import { LogIn, Mail, Lock, AlertCircle } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);
  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    try {
      const response = await loginUser(formData);
      if (response && response.body) {
        localStorage.setItem('loggedinuser', JSON.stringify(response.body));
        setUser(formData);
        navigate('/');
      }
    } catch (error) {
      setErrorMessage(error.message === 'Invalid credentials' 
        ? 'Enrollment not found. Please verify your credentials or register.' 
        : error.message);
    }
  };

  return (
    <div className="min-h-[calc(100vh-120px)] flex items-center justify-center py-12 px-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-scholar-cream p-10 border border-scholar-brown/10 shadow-2xl relative"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-scholar-brown-light/20" />
        
        <div className="text-center mb-10">
          <h2 className="text-4xl font-serif mb-2 tracking-tight">Access Ledger</h2>
          <p className="text-[10px] uppercase tracking-[0.3em] text-scholar-brown-light opacity-60">Verification Required</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
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
              <Lock size={12} /> Confidential Cipher
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

          {errorMessage && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }}
              className="p-4 bg-scholar-terracotta/5 border border-scholar-terracotta/20 text-scholar-terracotta text-xs flex items-center gap-3 italic"
            >
              <AlertCircle size={14} /> {errorMessage}
            </motion.div>
          )}

          <button 
            type="submit" 
            className="w-full py-4 bg-scholar-brown text-scholar-cream uppercase tracking-widest text-xs hover:bg-scholar-green transition-all duration-500 flex items-center justify-center gap-3 shadow-lg"
          >
            <LogIn size={16} /> Authenticate Session
          </button>
        </form>

        <div className="mt-12 pt-8 border-t border-scholar-brown/5 text-center">
          <p className="text-xs text-scholar-brown-light opacity-60 font-sans tracking-wide">
            First time at the study? 
            <Link to="/signup" className="ml-2 text-scholar-green hover:underline decoration-1 underline-offset-4">Register Enrollment</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
