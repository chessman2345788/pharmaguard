import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, User, Minimize2, Sparkles, Loader2 } from 'lucide-react';
import { useStore } from '../store/useStore';
import { geminiChatService } from '../utils/geminiChatService';

const FloatingChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { analysisResults, selectedDrugs } = useStore();
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Hello! I am your PharmaGuard AI clinical assistant. I can explain your pharmacogenomic results or provide general drug-gene education. How can I assist you today?' }
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
      // Pass the analysis results if they exist, otherwise null
      const response = await geminiChatService(text, analysisResults);
      
      setMessages(prev => [...prev, { role: 'bot', text: response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'bot', text: "AI assistant temporarily unavailable. Please check your connection or try again later." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const QuickButton = ({ text, onClick }) => (
    <button 
      disabled={isLoading}
      onClick={() => onClick(text)}
      className="flex-shrink-0 px-4 py-2 bg-gray-50 hover:bg-primary/10 hover:text-primary rounded-xl text-[11px] font-black text-gray-500 transition-all border border-transparent hover:border-primary/20 disabled:opacity-50 whitespace-nowrap mb-2"
    >
      {text}
    </button>
  );

  return (
    <div className="fixed bottom-8 right-8 z-[100]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 40 }}
            className="mb-6 w-80 sm:w-[480px] bg-white rounded-[2.5rem] shadow-[0_30px_100px_-20px_rgba(0,0,0,0.25)] border border-gray-100 overflow-hidden flex flex-col h-[700px]"
          >
            {/* Header */}
            <div className="bg-primary p-8 text-white relative">
              <motion.div 
                animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
                transition={{ duration: 6, repeat: Infinity }}
                className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full -mr-20 -mt-20 blur-3xl opacity-30" 
              />
              <div className="flex justify-between items-center relative z-10">
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/20 shadow-inner">
                    <Bot className="w-8 h-8" />
                  </div>
                  <div>
                    <span className="font-black text-2xl block leading-none tracking-tight">PharmaGuard Assistant</span>
                    <span className="text-[10px] uppercase font-black tracking-[0.25em] text-white/70 mt-1.5 block">Precision AI Intelligence</span>
                  </div>
                </div>
                <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-2.5 rounded-2xl transition-all active:scale-95">
                  <Minimize2 className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Content Area */}
            <div ref={scrollRef} className="flex-1 p-8 overflow-y-auto space-y-8 bg-gray-50/10 scroll-smooth">
              {messages.map((m, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={i} 
                  className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] p-6 rounded-[2rem] text-[14px] leading-[1.6] shadow-sm ${
                    m.role === 'user' 
                      ? 'bg-primary text-white rounded-tr-none' 
                      : 'bg-white border border-gray-100 text-gray-700 rounded-tl-none font-medium'
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
                   <div className="bg-white border border-gray-100 p-6 rounded-[2rem] rounded-tl-none flex items-center space-x-4 shadow-sm">
                      <div className="flex space-x-1">
                        <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1 }} className="w-2 h-2 bg-primary rounded-full" />
                        <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-2 h-2 bg-primary rounded-full" />
                        <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-2 h-2 bg-primary rounded-full" />
                      </div>
                      <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Consulting Knowledge base...</span>
                   </div>
                </motion.div>
              )}
            </div>

            {/* Quick Suggestions & Interaction */}
            <div className="px-8 py-4 bg-white/80 backdrop-blur-md border-t border-gray-100">
              <div className="flex space-x-2 overflow-x-auto no-scrollbar pb-2">
                <QuickButton text="Explain CYP2D6" onClick={handleSend} />
                <QuickButton text="What is Poor Metabolizer?" onClick={handleSend} />
                <QuickButton text="Why is Clopidogrel ineffective?" onClick={handleSend} />
                <QuickButton text="Show dosing guidance" onClick={handleSend} />
              </div>

               <div className="relative flex items-center mt-2">
                 <input
                   type="text"
                   disabled={isLoading}
                   value={input}
                   onChange={(e) => setInput(e.target.value)}
                   onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                   placeholder="Ask about genes, drugs, or your results..."
                   className="w-full bg-gray-50 border-none rounded-[1.8rem] text-sm focus:ring-4 focus:ring-primary/5 p-6 pr-20 transition-all placeholder:text-gray-300 font-medium"
                 />
                 <button 
                   disabled={isLoading}
                   onClick={() => handleSend()}
                   className="absolute right-3 w-14 h-14 bg-primary text-white rounded-[1.2rem] flex items-center justify-center hover:bg-primary-dark shadow-xl shadow-primary/20 transition-all active:scale-90 disabled:bg-gray-200 disabled:shadow-none"
                 >
                   {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Send className="w-6 h-6" />}
                 </button>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative">
        <motion.div
          animate={{ scale: [1, 1.5, 1], opacity: [0.6, 0, 0.6] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 bg-primary rounded-full -z-10"
        />
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(!isOpen)}
          className={`w-18 h-18 rounded-[2rem] flex items-center justify-center shadow-[0_15px_40px_-10px_rgba(22,163,74,0.4)] transition-all duration-500 overflow-hidden ${
            isOpen ? 'bg-gray-900 text-white' : 'bg-primary text-white'
          }`}
        >
          {isOpen ? <X className="w-9 h-9" /> : <MessageSquare className="w-9 h-9" />}
          {!isOpen && (
            <motion.span 
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -top-1 -right-1 w-6 h-6 bg-emerald-400 rounded-full border-4 border-white flex items-center justify-center shadow-lg"
            >
              <Sparkles className="w-3 h-3 text-white" />
            </motion.span>
          )}
        </motion.button>
      </div>
    </div>
  );
};

export default FloatingChatbot;
