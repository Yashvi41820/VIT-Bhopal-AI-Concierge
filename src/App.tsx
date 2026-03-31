/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Send, 
  User, 
  Bot, 
  Info, 
  BookOpen, 
  GraduationCap, 
  Briefcase, 
  MapPin, 
  Calendar,
  Sparkles,
  ChevronRight,
  ExternalLink,
  MessageSquare,
  Mic
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { VoiceInterface } from './components/VoiceInterface';
import { SYSTEM_INSTRUCTION } from './constants';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export default function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Welcome to VIT Bhopal! I'm V-Guide. How can I help you explore our campus today?",
      sender: 'bot',
      timestamp: new Date(),
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'voice'>('chat');
  
  const chatEndRef = useRef<HTMLDivElement>(null);
  const aiRef = useRef<any>(null);

  useEffect(() => {
    aiRef.current = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputText.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    try {
      const response = await aiRef.current.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [...messages.map(m => ({
          role: m.sender === 'user' ? 'user' : 'model',
          parts: [{ text: m.text }]
        })), { role: 'user', parts: [{ text: inputText }] }],
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
        }
      });

      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: response.text || "I'm sorry, I couldn't process that. Please try again.",
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error("Chat Error:", error);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: "Connection error. Please check your internet and try again.",
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleTranscription = (text: string, isModel: boolean) => {
    console.log(`Transcription (${isModel ? 'Model' : 'User'}): ${text}`);
  };

  const quickLinks = [
    { label: 'Admissions', icon: GraduationCap, url: 'https://vitbhopal.ac.in/admissions/' },
    { label: 'Placements', icon: Briefcase, url: 'https://vitbhopal.ac.in/placements/' },
    { label: 'FFCS', icon: BookOpen, url: 'https://vitbhopal.ac.in/ffcs/' },
    { label: 'Hostels', icon: MapPin, url: 'https://vitbhopal.ac.in/hostels/' },
  ];

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-slate-50 overflow-hidden">
      {/* Sidebar / Info Panel */}
      <aside className="lg:w-80 vit-gradient text-white p-6 flex flex-col gap-8 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-vit-blue font-black text-2xl">V</span>
          </div>
          <div>
            <h1 className="font-display font-bold text-xl tracking-tight">V-GUIDE</h1>
            <p className="text-xs text-white/60 font-medium uppercase tracking-widest">AI Concierge</p>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-4">Quick Navigation</h2>
            <div className="grid grid-cols-1 gap-2">
              {quickLinks.map((link) => (
                <a 
                  key={link.label}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <link.icon className="w-4 h-4 text-vit-orange" />
                    <span className="text-sm font-medium">{link.label}</span>
                  </div>
                  <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-vit-orange" />
              <h3 className="text-sm font-bold">Future Ready</h3>
            </div>
            <p className="text-xs text-white/70 leading-relaxed">
              VIT Bhopal is the first university in the region to offer 100% Doctoral Faculty and a tech-integrated learning environment.
            </p>
          </div>
        </div>

        <div className="mt-auto pt-6 border-t border-white/10">
          <div className="flex items-center gap-2 text-xs text-white/50">
            <Info className="w-3 h-3" />
            <span>Official VIT Bhopal Assistant</span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative h-[100vh]">
        {/* Header Tabs */}
        <header className="h-16 border-b border-slate-200 bg-white flex items-center px-6 justify-between shrink-0">
          <div className="flex gap-4">
            <button 
              onClick={() => setActiveTab('chat')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'chat' ? 'bg-vit-blue text-white' : 'text-slate-500 hover:bg-slate-100'}`}
            >
              <MessageSquare className="w-4 h-4" />
              Chat Mode
            </button>
            <button 
              onClick={() => setActiveTab('voice')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'voice' ? 'bg-vit-orange text-white' : 'text-slate-500 hover:bg-slate-100'}`}
            >
              <Mic className="w-4 h-4" />
              Voice Mode
            </button>
          </div>
          
          <div className="hidden sm:flex items-center gap-4 text-xs font-bold text-slate-400">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span>SYSTEM ONLINE</span>
            </div>
          </div>
        </header>

        {/* Chat / Voice View */}
        <div className="flex-1 overflow-hidden relative">
          <AnimatePresence mode="wait">
            {activeTab === 'chat' ? (
              <motion.div 
                key="chat"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="h-full flex flex-col"
              >
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  {messages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex gap-3 max-w-[85%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-sm ${msg.sender === 'user' ? 'bg-vit-blue text-white' : 'bg-white border border-slate-200 text-vit-blue'}`}>
                          {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                        </div>
                        <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                          msg.sender === 'user' 
                            ? 'bg-vit-blue text-white rounded-tr-none' 
                            : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none'
                        }`}>
                          <div className="whitespace-pre-wrap">{msg.text}</div>
                          <div className={`text-[10px] mt-2 font-medium ${msg.sender === 'user' ? 'text-white/50' : 'text-slate-400'}`}>
                            {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-vit-blue flex items-center justify-center shadow-sm">
                          <Bot className="w-4 h-4" />
                        </div>
                        <div className="bg-white border border-slate-200 p-4 rounded-2xl rounded-tl-none shadow-sm">
                          <div className="flex gap-1">
                            <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, repeat: Infinity }} className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
                            <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, repeat: Infinity, delay: 0.2 }} className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
                            <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, repeat: Infinity, delay: 0.4 }} className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>

                {/* Chat Input */}
                <div className="p-6 bg-white border-t border-slate-200">
                  <form onSubmit={handleSendMessage} className="relative max-w-4xl mx-auto">
                    <input
                      type="text"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      placeholder="Ask V-Guide about VIT Bhopal..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-6 pr-14 text-sm focus:outline-none focus:ring-2 focus:ring-vit-blue/20 focus:border-vit-blue transition-all"
                    />
                    <button
                      type="submit"
                      disabled={!inputText.trim() || isTyping}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-vit-blue text-white rounded-xl flex items-center justify-center hover:bg-vit-blue/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                  <p className="text-[10px] text-center text-slate-400 mt-4 font-medium uppercase tracking-widest">
                    Empowering the Future with AI
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="voice"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                className="h-full flex flex-col items-center justify-center p-6"
              >
                <div className="max-w-md w-full glass-panel rounded-3xl p-12 flex flex-col items-center gap-8 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-vit-blue via-vit-orange to-vit-gold" />
                  
                  <div className="text-center space-y-2">
                    <h2 className="text-2xl font-display font-bold text-slate-800">Voice Concierge</h2>
                    <p className="text-sm text-slate-500">Speak naturally with V-Guide for instant campus assistance.</p>
                  </div>

                  <VoiceInterface onTranscription={handleTranscription} />

                  <div className="w-full space-y-4 mt-4">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Try asking</div>
                    <div className="flex flex-wrap justify-center gap-2">
                      {['Placement stats', 'FFCS system', 'Hostel life'].map(tip => (
                        <span key={tip} className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-medium border border-slate-200">
                          "{tip}"
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

