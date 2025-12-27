import { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, Send, X, Bot, User, Minimize2, 
  Globe, ChevronDown, MoreHorizontal, Sparkles 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHealthStore } from '../../store/useHealthStore';
import apiClient from '../../api/apiClient';
import toast from 'react-hot-toast';

export default function CommonChatbot() {
  const { language: globalLanguage } = useHealthStore();
  const [isOpen, setIsOpen] = useState(false);
  const [chatLanguage, setChatLanguage] = useState(globalLanguage || 'en');
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      text: "Namaste! I am your AI Health Assistant. How can I help you with your wellness today?", 
      sender: 'bot',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'हिन्दी' },
    { code: 'bn', name: 'বাংলা' },
    { code: 'ta', name: 'தமிழ்' },
    { code: 'te', name: 'తెలుగు' }
  ];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { 
      id: Date.now(), 
      text: input, 
      sender: 'user',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await apiClient.post('/common-chat', { 
        message: input,
        language: chatLanguage 
      });
      
      const botMsg = { 
        id: Date.now() + 1, 
        text: response.data.reply, 
        sender: 'bot',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      setTimeout(() => {
        const botMsg = { 
          id: Date.now() + 1, 
          text: `I'm analyzing your request in ${languages.find(l => l.code === chatLanguage).name}. How else can I assist?`, 
          sender: 'bot',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, botMsg]);
        setIsTyping(false);
      }, 1500);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end font-sans">
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="mb-4 w-[90vw] md:w-[420px] h-[600px] bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-gray-100 flex flex-col overflow-hidden"
          >
            {/* Enhanced Header */}
            <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-6 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <Sparkles size={120} />
              </div>
              
              <div className="flex justify-between items-start relative z-10">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="bg-white/20 backdrop-blur-md p-2.5 rounded-2xl border border-white/30">
                      <Bot size={28} className="text-white" />
                    </div>
                    <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-blue-700 rounded-full"></span>
                  </div>
                  <div>
                    <h3 className="font-bold text-xl tracking-tight leading-none">PulseNet AI</h3>
                    <p className="text-blue-100 text-xs mt-1.5 flex items-center gap-1 font-medium">
                      <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                      Always active
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsOpen(false)} 
                  className="hover:bg-white/20 p-2 rounded-full transition-all active:scale-90"
                >
                  <Minimize2 size={20} />
                </button>
              </div>

              {/* Styled Language Selector */}
              <div className="mt-5 relative z-10">
                <div className="flex items-center gap-3 bg-black/15 hover:bg-black/25 backdrop-blur-md px-5 py-2.5 rounded-2xl border border-white/20 transition-all cursor-pointer">
                    <Globe size={15} className="text-blue-200 shrink-0" />

                    <select
                    value={chatLanguage}
                    onChange={(e) => setChatLanguage(e.target.value)}
                    className="bg-transparent text-sm font-semibold text-white outline-none flex-grow appearance-none cursor-pointer"
                    >
                    {languages.map(lang => (
                        <option
                        key={lang.code}
                        value={lang.code}
                        className="text-gray-900 font-medium"
                        >
                        {lang.name}
                        </option>
                    ))}
                    </select>

                    <ChevronDown
                    size={16}
                    className="text-blue-200 pointer-events-none"
                    />
                </div>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-grow overflow-y-auto p-6 space-y-6 bg-[#F8FAFC]">
              {messages.map((msg, idx) => (
                <motion.div 
                  initial={{ opacity: 0, x: msg.sender === 'user' ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={msg.id} 
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex gap-3 max-w-[85%] ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-1 shadow-sm ${
                      msg.sender === 'bot' ? 'bg-blue-100 text-blue-600' : 'bg-indigo-600 text-white'
                    }`}>
                      {msg.sender === 'bot' ? <Bot size={16} /> : <User size={16} />}
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className={`px-4 py-3 rounded-2xl text-[14px] leading-relaxed shadow-sm ${
                        msg.sender === 'bot' 
                          ? 'bg-white text-gray-700 rounded-tl-none border border-gray-200/50' 
                          : 'bg-indigo-600 text-white rounded-tr-none'
                      }`}>
                        {msg.text}
                      </div>
                      <span className={`text-[10px] font-medium text-gray-400 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                        {msg.time}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {isTyping && (
                <div className="flex gap-3">
                  <div className="bg-blue-100 text-blue-600 w-8 h-8 rounded-xl flex items-center justify-center shadow-sm">
                    <Bot size={16} />
                  </div>
                  <div className="bg-white px-5 py-4 rounded-2xl rounded-tl-none border border-gray-100 flex gap-1.5 items-center shadow-sm">
                    <motion.span animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 0.6 }} className="w-1.5 h-1.5 bg-blue-400 rounded-full"></motion.span>
                    <motion.span animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-1.5 h-1.5 bg-blue-400 rounded-full"></motion.span>
                    <motion.span animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-1.5 h-1.5 bg-blue-400 rounded-full"></motion.span>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Enhanced Input Area */}
            <div className="p-5 bg-white border-t border-gray-100">
              <form 
                onSubmit={handleSendMessage}
                className="relative flex items-center gap-2 bg-gray-50 rounded-2xl p-1.5 border border-gray-200 focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-50 transition-all"
              >
                <input 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask me anything..."
                  className="flex-grow bg-transparent px-4 py-2.5 text-sm outline-none placeholder:text-gray-400"
                />
                <button 
                  type="submit"
                  disabled={!input.trim()}
                  className="bg-indigo-600 disabled:bg-gray-300 text-white p-3 rounded-xl hover:bg-indigo-700 shadow-md transition-all active:scale-90 flex items-center justify-center"
                >
                  <Send size={18} />
                </button>
              </form>
              <p className="text-[10px] text-center text-gray-400 mt-3 font-medium uppercase tracking-widest">
                Powered by PulseNet Health Intelligence
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB with Notification Badge */}
      <motion.button 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`${
          isOpen ? 'bg-white text-gray-800' : 'bg-indigo-600 text-white'
        } p-4 rounded-3xl shadow-[0_15px_30px_rgba(79,70,229,0.3)] transition-colors duration-300 group relative border-2 border-transparent ${isOpen ? 'border-gray-100' : ''}`}
      >
        {isOpen ? <X size={28} /> : (
          <div className="relative">
            <MessageSquare size={28} />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 border-2 border-white rounded-full"></span>
          </div>
        )}
        
        {!isOpen && (
          <div className="absolute right-full mr-6 top-1/2 -translate-y-1/2 bg-white text-gray-800 px-5 py-3 rounded-2xl shadow-xl border border-gray-100 text-sm font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all pointer-events-none translate-x-2 group-hover:translate-x-0">
            Chat with PulseNet AI
            <div className="absolute top-1/2 -right-2 -translate-y-1/2 border-8 border-transparent border-l-white"></div>
          </div>
        )}
      </motion.button>
    </div>
  );
}