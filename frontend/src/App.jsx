import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Topbar from './components/Topbar';
import HomePage from './pages/HomePage';
import ChatPage from './pages/ChatPage';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#fdf8f2]">
        <Topbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/chat" element={<ChatPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
