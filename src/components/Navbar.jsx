import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Menu, X, ChevronRight } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Analyze', path: '/analyze' },
    { name: 'Analytics', path: '/analytics' },
    { name: 'About', path: '/about' },
  ];

  return (
    <nav 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-700 ${
        scrolled 
          ? 'py-4 bg-white/70 backdrop-blur-2xl border-b border-gray-100/50 shadow-[0_4px_30px_rgba(0,0,0,0.03)]' 
          : 'py-6 bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <motion.div 
              whileHover={{ rotate: 15, scale: 1.1 }}
              className="w-11 h-11 bg-primary rounded-2xl flex items-center justify-center shadow-[0_10px_20px_-5px_rgba(22,163,74,0.3)] transition-all duration-500"
            >
              <Activity className="text-white w-6 h-6" />
            </motion.div>
            <div className="flex flex-col">
              <span className="text-xl font-black text-gray-900 tracking-tighter leading-none">
                PharmaGuard <span className="text-primary italic">AI</span>
              </span>
              <div className="flex items-center space-x-2">
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.3em] leading-none">
                  Precision Systems
                </span>
                <span className="text-[8px] font-bold text-gray-300 uppercase tracking-widest opacity-60 flex items-center">
                  <span className="w-1 h-1 bg-gray-200 rounded-full mx-2" />
                  Powered by Pharmacogenomic Knowledge Engine
                </span>
              </div>
            </div>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-12">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="relative group py-2"
              >
                <span className={`text-[11px] font-black uppercase tracking-[0.2em] transition-colors duration-300 ${
                  location.pathname === link.path ? 'text-primary' : 'text-gray-400 hover:text-gray-900'
                }`}>
                  {link.name}
                </span>
                
                {/* Refined Underline Animation */}
                <motion.div 
                  initial={false}
                  animate={{ 
                    width: location.pathname === link.path ? '100%' : '0%',
                    opacity: location.pathname === link.path ? 1 : 0
                  }}
                  className="absolute bottom-0 left-0 h-0.5 bg-primary rounded-full transition-all group-hover:w-full group-hover:opacity-100"
                />
              </Link>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="h-6 w-px bg-gray-100 mx-2" />
            <Link 
              to="/analyze" 
              className="px-6 py-3 bg-gray-900 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-xl shadow-gray-200 hover:bg-primary hover:shadow-primary/20 transition-all active:scale-95 flex items-center space-x-2"
            >
              <span>Initialize Analysis</span>
              <ChevronRight className="w-4 h-4 opacity-50" />
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-gray-600 hover:text-primary transition-colors bg-gray-50 rounded-xl"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white/95 backdrop-blur-xl border-b border-gray-100 overflow-hidden shadow-2xl"
          >
            <div className="px-6 py-12 space-y-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className="block text-2xl font-black text-gray-900 hover:text-primary transition-colors tracking-tighter"
                >
                  {link.name}
                </Link>
              ))}
              <Link
                to="/analyze"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-between w-full px-8 py-5 bg-primary text-white font-black rounded-2xl shadow-xl shadow-primary/20"
              >
                <span>Start Analysis</span>
                <ChevronRight className="w-6 h-6" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
