import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, User, Minimize2, Sparkles, Loader2 } from 'lucide-react';
import { useStore } from '../store/useStore';
import { getClinicalResponse } from '../utils/aiAssistant';

const FloatingChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { analysisResults, selectedDrugs } = useStore();
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Hello! I am your PharmaGuard AI medical assistant. How can I help you understand your pharmacogenomic report today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async (customInput = null) => {
    const text = customInput || input;
    if (!text.trim() || isLoading) return;

    const userMsg = { role: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const context = {
        analysisResults,
        selectedDrugs,
        timestamp: new Date().toISOString()
      };
      
      const response = await getClinicalResponse(text, context);
      
      setMessages(prev => [...prev, { role: 'bot', text: response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'bot', text: "Clinical assistant temporarily unavailable." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 40 }}
            className="mb-6 w-80 sm:w-[450px] bg-white rounded-[2.5rem] shadow-[0_20px_80px_-15px_rgba(0,0,0,0.2)] border border-gray-100 overflow-hidden flex flex-col h-[650px]"
          >
            {/* Header */}
            <div className="bg-primary p-7 text-white relative">
              <motion.div 
                animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -mr-16 -mt-16 blur-3xl" 
              />
              <div className="flex justify-between items-center relative z-10">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30">
                    <Bot className="w-7 h-7" />
                  </div>
                  <div>
                    <span className="font-black text-xl block leading-none tracking-tight">Clinical Assistant</span>
                    <span className="text-[9px] uppercase font-black tracking-[0.2em] opacity-80 mt-1 block">Pharmacogenomics Layer</span>
                  </div>
                </div>
                <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-2.5 rounded-2xl transition-all">
                  <Minimize2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div ref={scrollRef} className="flex-1 p-6 overflow-y-auto space-y-6 bg-gray-50/20 scroll-smooth">
              {messages.map((m, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={i} 
                  className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`p-5 rounded-[1.8rem] text-sm leading-relaxed shadow-sm ${
                    m.role === 'user' 
                      ? 'bg-primary text-white ml-12 rounded-tr-none' 
                      : 'bg-white border border-gray-100 text-gray-700 mr-12 rounded-tl-none font-medium'
                  }`}>
                    {m.text.split('\n').map((line, idx) => (
                      <React.Fragment key={idx}>
                        {line}
                        <br />
                      </React.Fragment>
                    ))}
                  </div>
                </motion.div>
              ))}
              
              {isLoading && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                   <div className="bg-white border border-gray-100 p-5 rounded-[1.8rem] rounded-tl-none flex items-center space-x-3 shadow-sm">
                      <Loader2 className="w-4 h-4 text-primary animate-spin" />
                      <span className="text-xs font-bold text-gray-400 animate-pulse tracking-wide">Analyzing clinical knowledge...</span>
                   </div>
                </motion.div>
              )}
            </div>

            {/* Quick Suggestions */}
            <div className="px-6 py-4 flex space-x-2 overflow-x-auto no-scrollbar bg-white border-t border-gray-50">
              {[
                'Why is Codeine risky?', 
                'Explain CYP2C19 Poor Metabolizer', 
                'Show dosing guidance',
                'What does PM phenotype mean?'
              ].map((q) => (
                <button 
                  key={q}
                  disabled={isLoading}
                  onClick={() => handleSend(q)}
                  className="flex-shrink-0 px-4 py-2 bg-gray-50 hover:bg-primary/5 hover:text-primary rounded-xl text-[11px] font-black text-gray-400 transition-all border border-transparent hover:border-primary/20 disabled:opacity-50"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Input */}
            <div className="p-7 bg-white border-t border-gray-100">
               <div className="relative flex items-center">
                 <input
                   type="text"
                   disabled={isLoading}
                   value={input}
                   onChange={(e) => setInput(e.target.value)}
                   onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                   placeholder="Review pharmacogenomic findings..."
                   className="w-full bg-gray-50 border-none rounded-[1.5rem] text-sm focus:ring-4 focus:ring-primary/5 p-5 pr-16 transition-all placeholder:text-gray-300 font-medium"
                 />
                 <button 
                   disabled={isLoading}
                   onClick={() => handleSend()}
                   className="absolute right-2.5 w-12 h-12 bg-primary text-white rounded-2xl flex items-center justify-center hover:bg-primary-dark shadow-lg shadow-primary/20 transition-all active:scale-95 disabled:bg-gray-200 disabled:shadow-none"
                 >
                   {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                 </button>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative">
        <motion.div
          animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 bg-primary rounded-full -z-10"
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center shadow-2xl transition-all duration-500 overflow-hidden ${
            isOpen ? 'bg-gray-900 text-white' : 'bg-primary text-white'
          }`}
        >
          {isOpen ? <X className="w-8 h-8" /> : <MessageSquare className="w-8 h-8" />}
          {!isOpen && (
            <motion.span 
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-400 rounded-full border-2 border-white flex items-center justify-center"
            >
              <Sparkles className="w-2.5 h-2.5 text-white" />
            </motion.span>
          )}
        </motion.button>
      </div>
    </div>
  );
};

export default FloatingChatbot;
