import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, MessageCircle, Home, UtensilsCrossed } from 'lucide-react';

export default function Topbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  const linkCls = (active) =>
    `flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition ${
      active ? 'bg-orange-100 text-orange-700' : 'text-stone-600 hover:bg-stone-100'
    }`;

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-orange-100">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img
            src="/images/logos.png"
            alt="Kusina logo"
            className="w-9 h-9 rounded-xl object-cover shadow-sm"
          />
          <div className="leading-tight">
            <p className="font-bold text-stone-900">Kusina</p>
            <p className="text-xs text-stone-500 -mt-0.5">Dessert chatbot</p>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {isHome ? (
            <>
              <a href="#about" className={linkCls(false)}>
                <Home size={16} /> About
              </a>
              <a href="#feature" className={linkCls(false)}>
                <UtensilsCrossed size={16} /> Feature
              </a>
            </>
          ) : (
            <Link to="/" className={linkCls(false)}>
              <Home size={16} /> Home
            </Link>
          )}
          <Link to="/chat" className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold bg-stone-900 text-white hover:bg-stone-800 transition">
            <MessageCircle size={16} /> Chat
          </Link>
        </div>

        <button className="md:hidden p-2" onClick={() => setOpen(!open)} aria-label="menu">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden px-4 pb-4 flex flex-col gap-1 border-t border-orange-100 pt-2 bg-white">
          {isHome ? (
            <>
              <a href="#about" onClick={() => setOpen(false)} className={linkCls(false)}>About</a>
              <a href="#feature" onClick={() => setOpen(false)} className={linkCls(false)}>Feature (15 dishes)</a>
            </>
          ) : (
            <Link to="/" onClick={() => setOpen(false)} className={linkCls(false)}>Home</Link>
          )}
          <Link to="/chat" onClick={() => setOpen(false)} className="px-3 py-2 rounded-lg text-sm font-semibold bg-stone-900 text-white text-center">
            Start Chat
          </Link>
        </div>
      )}
    </nav>
  );
}
