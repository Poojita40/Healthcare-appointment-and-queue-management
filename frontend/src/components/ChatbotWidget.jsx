import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X, Send, Bot, Sparkles, User, AlertCircle, Loader } from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hello! I am **SmartCare Helper**, your virtual clinical advisor. Ask me anything about our medical legend panels, active queue meters, or describe your symptoms for triaging advice."
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const quickPrompts = [
    { label: "Book Appointment Help", text: "How do I book an appointment and get a queue token?" },
    { label: "Do you have Cardiology?", text: "Tell me about Dr. Arvind Sharma and the Cardiology department." },
    { label: "Symptom Triage", text: "I have joint pain and muscle stiffness. Which department should I choose?" },
    { label: "Live Queue Tracking", text: "What is the token/queue tracking feature?" }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      setTimeout(scrollToBottom, 100);
    }
  }, [messages, isOpen]);

  const handleSend = async (textToSend) => {
    const text = textToSend || input;
    if (!text.trim()) return;

    // Clear main input if we sent from input
    if (!textToSend) setInput('');

    const newMessages = [...messages, { role: 'user', content: text }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      // Call our secure Express API endpoint
      const response = await axios.post(`${API_BASE_URL}/chat`, { messages: newMessages });
      setMessages([...newMessages, { role: 'assistant', content: response.data.text }]);
    } catch (error) {
      console.error("Chatbot error:", error);
      setMessages([...newMessages, { 
        role: 'assistant', 
        content: "I apologize, but I encountered an error communicating with the clinical database. Please check your network connection or try again shortly." 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const parseMarkdown = (text) => {
    // Simple light parser for bold text and list markers to make it look highly styled!
    if (!text) return '';
    return text.split('\n').map((line, idx) => {
      let content = line;
      // Bold text **word**
      content = content.replace(/\*\*(.*?)\*\//g, '<strong class="font-bold text-gray-950">$1</strong>');
      // bullet points
      if (line.trim().startsWith('- ')) {
        return (
          <li key={idx} className="ml-4 list-disc text-gray-605 my-1 font-sans text-xs" dangerouslySetInnerHTML={{ __html: content.replace('- ', '') }} />
        );
      }
      return (
        <p key={idx} className="font-sans text-xs leading-relaxed text-gray-600 mb-2" dangerouslySetInnerHTML={{ __html: content }} />
      );
    });
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans" id="sc-chatbot-widget">
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            id="sc-chatbot-open-btn"
            className="w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shadow-xl shadow-blue-300 relative cursor-pointer group"
          >
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
            </span>
            <MessageSquare className="w-6 h-6 group-hover:scale-110 transition-transform" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="w-[360px] sm:w-[400px] h-[520px] bg-white rounded-3xl border border-gray-200 shadow-2xl flex flex-col overflow-hidden"
            id="sc-chatbot-window"
          >
            {/* Header */}
            <div className="bg-blue-600 px-5 py-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-550 flex items-center justify-center border border-blue-400/30">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-display font-extrabold text-sm tracking-tight">SmartCare Assistant</h4>
                    <Sparkles className="w-3.5 h-3.5 text-blue-200 fill-blue-200/20" />
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span className="text-[10px] text-blue-100 font-medium">Empathetic Triage AI</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                id="sc-chatbot-close-btn"
                className="w-8 h-8 rounded-full hover:bg-blue-700 flex items-center justify-center text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Medical Disclaimer Alert */}
            <div className="bg-amber-50 border-b border-amber-100 px-4 py-2 flex items-start gap-2">
              <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-[10px] text-amber-705 leading-normal font-medium">
                <strong>Disclaimer:</strong> AI advice is for preliminary triage. Please book a consultation with our clinicians for medical validation.
              </p>
            </div>

            {/* Message Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex gap-2.5 items-start max-w-[85%] ${
                    msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''
                  }`}
                >
                  <div className={`w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-[10px] uppercase font-bold ${
                    msg.role === 'user' ? 'bg-blue-100 text-blue-750' : 'bg-white border border-gray-200 text-gray-500'
                  }`}>
                    {msg.role === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                  </div>

                  <div className={`p-3.5 rounded-2xl shadow-xs text-xs leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-blue-600 text-white rounded-tr-none' 
                      : 'bg-white text-gray-750 border border-gray-100 rounded-tl-none'
                  }`}>
                    {msg.role === 'user' ? (
                      <p className="font-sans text-xs">{msg.content}</p>
                    ) : (
                      <div className="space-y-1">
                        {parseMarkdown(msg.content)}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex gap-2.5 items-start max-w-[85%]">
                  <div className="w-7 h-7 rounded-full shrink-0 bg-white border border-gray-200 text-gray-500 flex items-center justify-center">
                    <Loader className="w-3.5 h-3.5 animate-spin" />
                  </div>
                  <div className="p-3 bg-white text-gray-400 border border-gray-150 rounded-2xl rounded-tl-none shadow-xs text-xs flex items-center gap-2">
                    <span>Consulting clinical specialist logs...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompt Cards */}
            {messages.length === 1 && (
              <div className="px-4 py-3 border-t border-gray-100 bg-white">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Frequently Asked:</p>
                <div className="flex flex-wrap gap-1.5">
                  {quickPrompts.map((p, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(p.text)}
                      className="text-[10.5px] bg-blue-50/60 hover:bg-blue-100/70 border border-blue-100/50 text-blue-700 px-2.5 py-1.5 rounded-lg text-left transition-all active:scale-95 cursor-pointer font-medium"
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Line */}
            <form 
              onSubmit={(e) => { e.preventDefault(); handleSend(); }} 
              className="p-3 bg-white border-t border-gray-150 flex gap-2 items-center"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Describe symptoms or query..."
                disabled={isLoading}
                className="flex-1 text-xs px-3.5 py-2.5 border border-gray-200 hover:border-gray-300 focus:border-blue-500 focus:outline-hidden rounded-xl bg-gray-50/50 disabled:opacity-50 font-medium"
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                id="sc-chatbot-send-btn"
                className="w-9 text-white bg-blue-600 hover:bg-blue-700 active:scale-95 disabled:opacity-40 disabled:scale-100 p-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center shadow-md shadow-blue-100"
              >
                <Send className="w-4 h-4 ml-0.5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
