import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertTriangle, Home, RefreshCcw } from 'lucide-react';

const ErrorPage = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-8 border border-red-100">
           <AlertTriangle className="w-12 h-12 text-red-500" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Diagnosis Error</h1>
        <p className="text-gray-500 max-w-md mx-auto mb-10 leading-relaxed text-lg">
           We couldn't find the page you were looking for. It might have moved or is still under clinical trial.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
           <Link to="/" className="btn-primary flex items-center space-x-2 w-full sm:w-auto">
              <Home className="w-5 h-5" />
              <span>Return Home</span>
           </Link>
           <button 
             onClick={() => window.location.reload()}
             className="px-8 py-3 border border-gray-200 rounded-xl font-bold text-gray-600 hover:bg-gray-50 transition-all flex items-center space-x-2 w-full sm:w-auto"
           >
              <RefreshCcw className="w-5 h-5" />
              <span>Try Again</span>
           </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ErrorPage;
