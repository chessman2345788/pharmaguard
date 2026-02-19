import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Github, Twitter, Linkedin, Heart, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white pt-24 pb-12 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          
          <div className="col-span-1 md:col-span-2 flex flex-col items-start">
            <Link to="/" className="flex items-center space-x-3 mb-6 group">
              <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center border border-primary/10">
                <Activity className="text-primary w-5 h-5" />
              </div>
              <span className="text-lg font-black text-gray-900 tracking-tighter">
                PharmaGuard <span className="text-primary">AI</span>
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-8 max-w-sm font-medium">
              A clinical decision support platform for pharmacogenomic risk assessment and personalized medicine.
            </p>
            <div className="flex space-x-6">
              <a href="https://github.com/chessman2345788/pharmaguard.git" className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-primary transition-colors">GitHub Repository</a>
              <button onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-primary transition-colors">Documentation</button>
            </div>
          </div>

          <div className="col-span-1">
            <h4 className="font-black text-gray-900 mb-6 uppercase text-[9px] tracking-[0.3em]">Navigation</h4>
            <ul className="space-y-3">
              {[
                { name: 'Home', path: '/' },
                { name: 'Analyze', path: '/analyze' },
                { name: 'Analytics', path: '/analytics' },
                { name: 'About', path: '/about' }
              ].map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="text-[10px] font-bold text-gray-400 hover:text-primary transition-colors uppercase tracking-[0.2em]">{link.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-1">
            <h4 className="font-black text-gray-900 mb-6 uppercase text-[9px] tracking-[0.3em]">Contact</h4>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] leading-loose">
              Clinical Support<br />
              safety@pharmaguard.ai
            </p>
          </div>
        </div>

        <div className="border-t border-gray-50 pt-12 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-gray-400 text-[9px] font-black uppercase tracking-[0.2em]">
            © 2026 PharmaGuard AI • Clinical Decision Support Systems
          </p>
          
          <div className="flex items-center space-x-6 text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">
            <span>Security</span>
            <span>Privacy</span>
            <span>Terms</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
