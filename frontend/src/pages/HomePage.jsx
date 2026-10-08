import React from 'react';
import Hero from '../components/Hero';
import DishGrid from '../components/DishGrid';
import { Link } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';

export default function HomePage() {
  return (
    <div>
      <Hero />
      <DishGrid />
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <div className="bg-stone-900 rounded-2xl p-8 md:p-10 text-center text-white">
          <h3 className="text-2xl font-bold" style={{ fontFamily: 'Georgia, serif' }}>Not sure what to bake?</h3>
          <p className="text-stone-300 mt-2 text-sm">Tell the AI what ingredients you have — it will suggest a dessert.</p>
          <Link to="/chat" className="inline-flex items-center gap-2 mt-5 px-6 py-3 bg-orange-500 hover:bg-orange-600 rounded-xl font-semibold transition">
            <MessageCircle size={18} /> Chat now
          </Link>
        </div>
        <footer className="text-center text-xs text-stone-400 mt-8">
          Kusina • CCIT-06 • No database, no login
        </footer>
      </section>
    </div>
  );
}
