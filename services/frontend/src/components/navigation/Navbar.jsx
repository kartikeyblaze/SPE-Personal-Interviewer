import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../../useContext.jsx";
import { BookOpen, LogOut, Menu, X, Award } from "lucide-react";

export const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("loggedinuser");
    setUser(null);
    navigate("/login");
  };

  return (
    <header className="w-full py-8 px-6 md:px-12 border-b border-scholar-brown-light/20 bg-scholar-cream/50 backdrop-blur-sm sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-scholar-green text-scholar-cream rounded-sm shadow-sm">
            <BookOpen size={24} strokeWidth={1.5} />
          </div>
          <div>
            <h1 className="text-2xl tracking-tight text-scholar-brown uppercase leading-none">
              <Link to="/">Scholar's Study</Link>
            </h1>
            <p className="text-[10px] uppercase tracking-[0.2em] text-scholar-brown-light opacity-60">
              Personal Interviewer AI
            </p>
          </div>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8 font-sans text-xs uppercase tracking-widest text-scholar-brown">
          <Link to="/" className="hover:text-scholar-green transition-colors">Home</Link>
          <Link to="/speechToText" className="hover:text-scholar-green transition-colors">Interview</Link>

          {localStorage.getItem("loggedinuser") ? (
            <>
              <Link to="/results" className="flex items-center gap-2 hover:text-scholar-green transition-colors">
                <Award size={14} /> Results
              </Link>
              <button 
                onClick={logout}
                className="flex items-center gap-2 px-4 py-2 border border-scholar-brown/20 hover:bg-scholar-brown hover:text-scholar-cream transition-all duration-300"
              >
                <LogOut size={14} /> Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="px-4 py-2 bg-scholar-brown text-scholar-cream hover:bg-scholar-green transition-colors">
              Login
            </Link>
          )}
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-scholar-brown" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-scholar-cream border-b border-scholar-brown-light/20 p-6 flex flex-col gap-4 font-sans text-xs uppercase tracking-widest animate-in fade-in slide-in-from-top-4">
          <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/speechToText" onClick={() => setMenuOpen(false)}>Interview</Link>
          {localStorage.getItem("loggedinuser") ? (
            <>
              <Link to="/results" onClick={() => setMenuOpen(false)}>Results</Link>
              <button onClick={logout} className="text-left">Logout</button>
            </>
          ) : (
            <Link to="/login" onClick={() => setMenuOpen(false)}>Login</Link>
          )}
        </div>
      )}
    </header>
  );
};