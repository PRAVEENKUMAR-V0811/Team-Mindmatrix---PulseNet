import { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send, X, Bot, User, Minimize2, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CommonChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "Namaste! I am your Health Assistant. How can I help you today?", sender: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const quickActions = [
    "Common fever medicines?",
    "Symptoms of Malaria?",
    "How to use BP monitor?",
    "Emergency contacts"
  ];

  const handleSendMessage = async (text) => {
    const messageText = text || input;
    if (!messageText.trim()) return;

    // Add user message
    const userMsg = { id: Date.now(), text: messageText, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      // Logic for your teammate: Replace with your actual chatbot API call
      // const response = await apiClient.post('/common-chat', { message: messageText });
      
      // Simulated Bot Response
      setTimeout(() => {
        const botMsg = { 
          id: Date.now() + 1, 
          text: `I'm analyzing your query about "${messageText}". In a real scenario, I will provide medical guidance based on Indian health standards.`, 
          sender: 'bot' 
        };
        setMessages(prev => [...prev, botMsg]);
        setIsTyping(false);
      }, 1500);

    } catch (error) {
      toast.error("Chat service is currently offline.");
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-[90vw] md:w-[400px] h-[500px] bg-white rounded-3xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
          
          {/* Header */}
          <div className="bg-blue-600 p-4 text-white flex justify-between items-center shadow-lg">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-xl">
                <Bot size={24} />
              </div>
              <div>
                <h3 className="font-bold leading-tight">Med-AI Assistant</h3>
                <p className="text-[10px] text-blue-100 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                  Online for Rural Support
                </p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-1 rounded-lg transition-colors">
              <Minimize2 size={20} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-gray-50/50">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex gap-2 max-w-[80%] ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    msg.sender === 'bot' ? 'bg-blue-100 text-blue-600' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {msg.sender === 'bot' ? <Bot size={16} /> : <User size={16} />}
                  </div>
                  <div className={`p-3 rounded-2xl text-sm shadow-sm ${
                    msg.sender === 'bot' 
                      ? 'bg-white text-gray-800 rounded-tl-none border border-gray-100' 
                      : 'bg-blue-600 text-white rounded-tr-none'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex gap-2">
                <div className="bg-blue-100 text-blue-600 w-8 h-8 rounded-full flex items-center justify-center">
                  <Bot size={16} />
                </div>
                <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-gray-100 flex gap-1">
                  <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Quick Actions Bar */}
          <div className="px-4 py-2 bg-white border-t border-gray-50 flex gap-2 overflow-x-auto no-scrollbar">
            {quickActions.map((action, i) => (
              <button 
                key={i}
                onClick={() => handleSendMessage(action)}
                className="whitespace-nowrap px-3 py-1.5 bg-blue-50 text-blue-600 text-xs font-bold rounded-full border border-blue-100 hover:bg-blue-100 transition-colors"
              >
                {action}
              </button>
            ))}
          </div>

          {/* Input Area */}
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
            className="p-4 bg-white border-t border-gray-100 flex gap-2"
          >
            <input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything..."
              className="flex-grow bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-blue-100 outline-none transition-all"
            />
            <button 
              type="submit"
              className="bg-blue-600 text-white p-2 rounded-xl hover:bg-blue-700 shadow-md shadow-blue-100 transition-all active:scale-95"
            >
              <Send size={20} />
            </button>
          </form>
        </div>
      )}

      {/* Floating Action Button (FAB) */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`${
          isOpen ? 'bg-gray-800 scale-90' : 'bg-blue-600 hover:bg-blue-700'
        } text-white p-4 rounded-full shadow-2xl transition-all duration-300 group relative`}
      >
        {isOpen ? <X size={28} /> : (
          <>
            <MessageSquare size={28} />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 border-2 border-white rounded-full"></span>
          </>
        )}
        
        {/* Tooltip for first-time users */}
        {!isOpen && (
          <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-white text-gray-800 px-4 py-2 rounded-xl shadow-xl border border-gray-100 text-sm font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
            Ask Med-AI Anything! ✨
          </div>
        )}
      </button>
    </div>
  );
}