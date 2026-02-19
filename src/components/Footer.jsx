import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Github, Twitter, Linkedin, Heart, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white pt-32 pb-16 overflow-hidden relative">
      {/* Decorative Top Divider */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-100 to-transparent" />
      
      {/* Background Polish */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-24">
          
          {/* Brand Column */}
          <div className="col-span-1 md:col-span-1 flex flex-col items-start">
            <Link to="/" className="flex items-center space-x-3 mb-8 group">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary transition-colors">
                <Activity className="text-primary group-hover:text-white w-5 h-5 transition-colors" />
              </div>
              <span className="text-xl font-black text-gray-900 tracking-tighter">
                PharmaGuard <span className="text-primary italic">AI</span>
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-10 max-w-[240px] font-medium">
              Empowering personalized clinic decisions through advanced genomic risk analysis.
            </p>
            <div className="flex space-x-5">
              {[Github, Twitter, Linkedin].map((Icon, i) => (
                <motion.a
                  key={i}
                  href="#"
                  whileHover={{ 
                    y: -4, 
                    scale: 1.1,
                    boxShadow: "0 0 15px rgba(22, 163, 74, 0.2)"
                  }}
                  className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-300 hover:text-primary hover:bg-primary/5 transition-all outline-none"
                >
                  <Icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          <div className="col-span-1">
            <h4 className="font-black text-gray-900 mb-8 uppercase text-[10px] tracking-[0.3em]">Platform</h4>
            <ul className="space-y-4">
              {['Features', 'Analytics', 'Genetic Grid', 'Case Studies'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-gray-400 hover:text-primary transition-colors font-bold uppercase tracking-widest text-[11px]">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-1">
            <h4 className="font-black text-gray-900 mb-8 uppercase text-[10px] tracking-[0.3em]">Resources</h4>
            <ul className="space-y-4">
              {['Documentation', 'CPIC API', 'Research', 'Security'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-gray-400 hover:text-primary transition-colors font-bold uppercase tracking-widest text-[11px]">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter / Contact Card */}
          <div className="col-span-1">
            <div className="bg-gray-50/50 p-8 rounded-[2.5rem] border border-gray-100 relative group overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl -mr-16 -mt-16 group-hover:bg-primary/10 transition-colors" />
              <h4 className="font-black text-gray-900 mb-4 tracking-tight">System Updates</h4>
              <p className="text-[11px] text-gray-400 mb-6 leading-relaxed font-medium uppercase tracking-widest">
                Join our newsletter for clinical genomic insights.
              </p>
              <div className="flex bg-white p-2 rounded-2xl shadow-sm border border-gray-100 transition-all focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary/30">
                <input 
                  type="email" 
                  placeholder="Clinical Email" 
                  className="bg-transparent border-none focus:ring-0 text-xs flex-1 px-3 font-bold uppercase tracking-tighter"
                />
                <button className="bg-primary text-white p-3 rounded-xl hover:bg-primary-dark transition-colors shadow-lg shadow-primary/20">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-16 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center space-x-6">
            <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">
              © 2026 PharmaGuard AI
            </p>
            <div className="h-4 w-px bg-gray-100" />
            <div className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-900">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              <span>All Systems Operational</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-300">
            <span>Built with</span>
            <Heart className="w-4 h-4 text-red-400 fill-current mx-1 animate-pulse" />
            <span>for Hackathon 2026</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
