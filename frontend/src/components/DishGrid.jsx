import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, BarChart3, Star, MessageCircle } from 'lucide-react';
import { dishes } from '../data/dishes';

function DishCard({ dish }) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-stone-100 shadow-sm hover:shadow-lg transition flex flex-col">
      <div className="relative">
        <img src={dish.image} alt={dish.name} className="w-full h-44 object-cover" loading="lazy" />
        <span className="absolute top-3 left-3 bg-white/90 text-xs font-semibold px-2.5 py-1 rounded-full text-stone-700">
          {dish.category}
        </span>
        <span className="absolute top-3 right-3 bg-stone-900/90 text-white text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
          <Star size={12} className="fill-yellow-400 text-yellow-400" /> {dish.rating}
        </span>
      </div>
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-bold text-stone-900">{dish.name}</h3>
        <p className="text-sm text-stone-600 mt-1 line-clamp-2 flex-1">{dish.description}</p>
        <div className="flex items-center gap-3 mt-3 text-xs text-stone-500">
          <span className="flex items-center gap-1"><Clock size={13} /> {dish.time}</span>
          <span className="flex items-center gap-1"><BarChart3 size={13} /> {dish.difficulty}</span>
        </div>
        <Link
          to={`/chat?dish=${encodeURIComponent(dish.name)}`}
          className="mt-3 flex items-center justify-center gap-2 text-sm font-semibold bg-orange-50 text-orange-700 hover:bg-orange-100 rounded-xl py-2.5 transition"
        >
          <MessageCircle size={15} /> Ask AI about this
        </Link>
      </div>
    </div>
  );
}

export default function DishGrid() {
  return (
    <section id="feature" className="max-w-6xl mx-auto px-4 py-14">
      <div className="flex items-end justify-between mb-6">
        <div>
          <p className="text-orange-600 font-semibold text-sm uppercase tracking-wide">Feature</p>
          <h2 className="text-2xl md:text-3xl font-bold text-stone-900" style={{ fontFamily: 'Georgia, serif' }}>
            15 Sample Dishes
          </h2>
          <p className="text-stone-500 text-sm mt-1">Click any card to chat about it</p>
        </div>
        <span className="hidden sm:inline-block text-sm bg-stone-900 text-white px-3 py-1.5 rounded-full font-semibold">
          {dishes.length} recipes
        </span>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {dishes.map((d) => (
          <DishCard key={d.id} dish={d} />
        ))}
      </div>
    </section>
  );
}
