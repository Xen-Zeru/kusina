import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, UtensilsCrossed, MessageCircle, Star } from 'lucide-react';

export default function Hero() {
  return (
    <section id="about" className="bg-gradient-to-b from-orange-50 to-white">
      <div className="max-w-6xl mx-auto px-4 py-14 md:py-20 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
            <Sparkles size={14} /> AI Dessert Assistant • No login needed
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-stone-900 leading-tight" style={{ fontFamily: 'Georgia, serif' }}>
            Craving something sweet? <span className="text-orange-500">Ask Kusina.</span>
          </h1>
          <p className="mt-4 text-stone-600 leading-relaxed">
            About: Kusina is a simple dessert chatbot.
            Browse 15 sample dishes below, then jump into Chat to ask for recipes,
            ingredients, or baking tips. No database, no login — just ask.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href="#feature" className="flex items-center gap-2 px-5 py-3 rounded-xl bg-orange-500 text-white font-semibold hover:bg-orange-600 transition">
              <UtensilsCrossed size={18} /> View 15 Dishes
            </a>
            <Link to="/chat" className="flex items-center gap-2 px-5 py-3 rounded-xl bg-stone-900 text-white font-semibold hover:bg-stone-800 transition">
              <MessageCircle size={18} /> Start Chat
            </Link>
          </div>
          <div className="mt-6 flex items-center gap-4 text-sm text-stone-500">
            <span className="flex items-center gap-1"><Star size={14} className="text-yellow-500 fill-yellow-500" /> 4.8 avg rating</span>
            <span>•</span><span>15 recipes</span>
            <span>•</span><span>Gemini-powered</span>
          </div>
        </div>
        <div className="relative">
          <img src="/images/mangofloat.jpg" alt="Featured dessert" className="rounded-2xl shadow-xl w-full h-80 object-cover" />
          <div className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-lg px-4 py-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-xl">🥭</div>
            <div>
              <p className="text-sm font-bold text-stone-900">Mango Float</p>
              <p className="text-xs text-stone-500">Most loved • 20 min</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
