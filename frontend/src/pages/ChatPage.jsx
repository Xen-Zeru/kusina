import React, { useState, useRef, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  Bot,
  User,
  Send,
  ArrowLeft,
  Trash2,
  Clock,
  ChefHat,
  CakeSlice,
  Wheat,
} from 'lucide-react';

const SUGGESTIONS = [
  { icon: CakeSlice, label: 'Easy dessert recipe' },
  { icon: ChefHat, label: 'Baking tips' },
  { icon: Wheat, label: 'What can I bake?' },
];

function timeNow() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// Markdown element styling — no raw # * shown, everything renders formatted
const mdComponents = {
  h1: ({ children }) => (
    <p className="font-bold text-stone-900 text-[15px] mt-2 first:mt-0 mb-1">{children}</p>
  ),
  h2: ({ children }) => (
    <p className="font-bold text-stone-900 text-sm mt-2 first:mt-0 mb-1">{children}</p>
  ),
  h3: ({ children }) => (
    <p className="font-bold text-stone-900 text-sm mt-2 first:mt-0 mb-1">{children}</p>
  ),
  p: ({ children }) => <p className="mb-1.5 last:mb-0">{children}</p>,
  strong: ({ children }) => <strong className="font-bold text-stone-900">{children}</strong>,
  ul: ({ children }) => <ul className="list-disc pl-5 mb-1.5 space-y-0.5">{children}</ul>,
  ol: ({ children }) => <ol className="list-decimal pl-5 mb-1.5 space-y-0.5">{children}</ol>,
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
  code: ({ children }) => (
    <code className="bg-orange-50 text-orange-700 rounded px-1 py-0.5 text-[13px]">{children}</code>
  ),
  hr: () => <hr className="border-orange-100 my-2" />,
};

function TypingDots() {
  return (
    <span className="typing-dots" aria-label="typing">
      <span />
      <span />
      <span />
    </span>
  );
}

const STORAGE_KEY = 'kusina-chat';

function loadStoredMessages() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    return null;
  } catch {
    return null;
  }
}

export default function ChatPage() {
  const [searchParams] = useSearchParams();
  const dishParam = searchParams.get('dish');
  const [messages, setMessages] = useState(() => {
    const stored = loadStoredMessages();
    if (stored) return stored;
    return [
      {
        sender: 'bot',
        text: dishParam
          ? `Yum! You picked ${dishParam}. Ask me for the recipe, ingredients, or baking tips!`
          : 'Hello! I am Kusina, your dessert assistant. Ask me for recipes, ingredients, or baking tips.',
        time: timeNow(),
      },
    ];
  });
  const [input, setInput] = useState(dishParam ? `How do I make ${dishParam}?` : '');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Persist for this browser session only — survives refresh,
  // cleared automatically when the tab/browser is closed.
  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {
      // storage full or unavailable — chat still works in memory
    }
  }, [messages]);

  const clearChat = () => {
    setMessages([
      {
        sender: 'bot',
        text: 'Fresh plate! What dessert should we talk about next?',
        time: timeNow(),
      },
    ]);
  };

// Backend base URL: set VITE_API_URL in production (Vercel),
// falls back to local dev server.
const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '');

  const sendMessage = async (text) => {
    const userMessage = (text ?? input).trim();
    if (!userMessage || loading) return;
    setInput('');
    setMessages((prev) => [...prev, { sender: 'user', text: userMessage, time: timeNow() }]);
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage }),
      });
      const data = await response.json();
      const botReply = data.reply || data.error || 'No response received from backend.';
      setMessages((prev) => [...prev, { sender: 'bot', text: botReply, time: timeNow() }]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages((prev) => [
        ...prev,
        { sender: 'bot', text: 'Error: Unable to connect to backend server.', time: timeNow() },
      ]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleSend = (e) => {
    e.preventDefault();
    sendMessage();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 md:py-8">
      <div className="flex items-center justify-between mb-4">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-stone-500 hover:text-stone-900 transition"
        >
          <span className="w-8 h-8 rounded-full bg-white border border-stone-200 flex items-center justify-center shadow-sm">
            <ArrowLeft size={16} />
          </span>
          Back to dishes
        </Link>
        <button
          onClick={clearChat}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-red-600 bg-white border border-stone-200 hover:border-red-200 rounded-full px-3 py-1.5 transition shadow-sm"
        >
          <Trash2 size={13} /> Clear chat
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-xl shadow-orange-100/60 border border-orange-100 overflow-hidden flex flex-col chat-shell">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-stone-900 via-stone-900 to-orange-950 text-white px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src="/images/logos.png"
                alt="Kusina logo"
                className="w-11 h-11 rounded-2xl object-cover shadow-lg"
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-400 border-2 border-stone-900 rounded-full" title="Online" />
            </div>
            <div className="flex-1">
              <h1 className="font-bold leading-tight">Kusina Chat</h1>
              <p className="text-xs text-stone-300 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
                Online • replies about desserts only
              </p>
            </div>
            {dishParam && (
              <span className="hidden sm:inline-block text-xs font-semibold bg-white/10 border border-white/15 rounded-full px-3 py-1.5 max-w-[180px] truncate">
                🍰 {dishParam}
              </span>
            )}
          </div>
        </div>

        {/* Messages */}
        <div className="chat-scroll flex-1 overflow-y-auto px-4 md:px-5 py-5 flex flex-col gap-4 bg-[radial-gradient(ellipse_at_top,#fff7ed_0%,#ffffff_60%)]">
          {messages.map((msg, index) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={index}
                className={`msg-in flex items-start gap-2.5 max-w-[88%] md:max-w-[82%] ${
                  isUser ? 'self-end flex-row-reverse' : 'self-start'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-sm mt-0.5 ${
                    isUser
                      ? 'bg-gradient-to-br from-orange-400 to-orange-600 text-white'
                      : 'bg-stone-900 text-orange-300'
                  }`}
                >
                  {isUser ? <User size={15} /> : <Bot size={15} />}
                </div>
                <div className={isUser ? 'flex flex-col items-end' : 'flex flex-col items-start'}>
                  <div
                    className={`px-4 py-3 text-sm leading-relaxed shadow-sm ${
                      isUser
                        ? 'whitespace-pre-wrap bg-gradient-to-br from-stone-900 to-stone-800 text-white rounded-2xl rounded-br-md'
                        : 'bg-white text-stone-800 border border-orange-100 rounded-2xl rounded-bl-md md-body'
                    }`}
                  >
                    {isUser ? (
                      msg.text
                    ) : (
                      <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>
                        {msg.text}
                      </ReactMarkdown>
                    )}
                  </div>
                  <span className="flex items-center gap-1 text-[11px] text-stone-400 mt-1 px-1">
                    <Clock size={10} /> {msg.time || ''}
                  </span>
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex items-start gap-2.5 self-start">
              <div className="w-8 h-8 rounded-xl bg-stone-900 text-orange-300 flex items-center justify-center shrink-0">
                <Bot size={15} />
              </div>
              <div className="bg-white border border-orange-100 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm flex items-center gap-2">
                <TypingDots />
                <span className="text-xs text-stone-400 italic">Kusina is baking a reply…</span>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Suggestions */}
        {messages.length <= 2 && !loading && (
          <div className="px-4 md:px-5 pb-2 pt-1 flex gap-2 overflow-x-auto bg-white">
            {SUGGESTIONS.map(({ icon: Icon, label }) => (
              <button
                key={label}
                onClick={() => sendMessage(label)}
                className="shrink-0 inline-flex items-center gap-1.5 text-xs font-semibold bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-100 rounded-full px-3.5 py-2 transition"
              >
                <Icon size={13} /> {label}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <form onSubmit={handleSend} className="p-3 md:p-4 border-t border-orange-100 bg-white">
          <div className="flex items-end gap-2 bg-stone-50 border border-stone-200 focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-100 rounded-2xl px-3 py-2 transition">
            <textarea
              ref={inputRef}
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
              placeholder="Ask for a recipe, e.g. How do I make Leche Flan?"
              className="flex-1 bg-transparent resize-none max-h-32 px-2 py-2 text-sm outline-none placeholder:text-stone-400 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              aria-label="Send message"
              className="shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 text-white flex items-center justify-center hover:from-orange-600 hover:to-orange-700 disabled:from-stone-300 disabled:to-stone-300 disabled:cursor-not-allowed transition shadow-md shadow-orange-200"
            >
              <Send size={16} />
            </button>
          </div>
          <p className="text-[11px] text-stone-400 text-center mt-2">
            Press Enter to send • Ask in any language • Desserts only
          </p>
        </form>
      </div>
    </div>
  );
}
