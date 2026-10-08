# 🍰 Kusina — Dessert Chatbot

Kusina is a dessert-themed AI chatbot website for **CCIT-06**. Browse **15 sample dishes**,
then chat with a Gemini-powered assistant that answers **food and dessert questions only** —
in **any language** you write in. No database, no login.

## ✨ Features

- **Topbar navigation** — About, Feature (15 dishes), Chat (separate `/chat` page)
- **Hero About section** with featured dish and quick actions
- **15 dish cards** — photo, category, rating, time, difficulty, and an "Ask AI about this" button that opens chat pre-filled with the dish
- **AI chat** — markdown-rendered replies, typing indicator, timestamps, suggestion chips,
  session-persisted history (survives refresh, cleared when the browser closes)
- **Food-only AI** — non-food questions get a polite refusal (translated to your language)
- **Multilingual** — the AI detects your language and replies in it (e.g. Tagalog, Spanish)

## 🛠️ Tech Stack

- **Frontend**: React, Vite, Tailwind CSS v4, React Router, Lucide icons, `react-markdown` + `remark-gfm`
- **Backend**: Node.js, Express, `cors`, `dotenv`, `@google/generative-ai` (Gemini)
- **Package manager**: `pnpm`

## 📁 Project Structure

```text
Kusina/
├── backend/
│   ├── controllers/chatController.js
│   ├── routes/chatRoutes.js
│   ├── services/chatService.js   # Gemini logic + food-only + multilingual prompt
│   ├── server.js
│   └── .env.example
└── frontend/
    ├── index.html
    ├── vite.config.mjs
    ├── public/images/            # 15 dish photos + logos.png
    └── src/
        ├── App.jsx               # Router: / and /chat
        ├── components/Topbar.jsx
        ├── components/Hero.jsx
        ├── components/DishGrid.jsx
        ├── pages/HomePage.jsx
        ├── pages/ChatPage.jsx
        └── data/dishes.js        # static 15-dish data (no DB)
```

## 🚀 Getting Started

### Prerequisites

Node.js v18+ and `pnpm` installed.

### 1. Backend

```bash
cd backend
pnpm install
cp .env.example .env
```

Add your key to `.env`:

```env
PORT=5000
GEMINI_API_KEY=your_actual_api_key_here
```

Start it:

```bash
pnpm start
```

> Backend runs on `http://localhost:5000`

### 2. Frontend

In a new terminal:

```bash
cd frontend
pnpm install
pnpm start
```

> Frontend runs on `http://localhost:3000`

## 🤖 AI Behavior

Configured in `backend/services/chatService.js` via the Gemini system instruction:

1. **Food-only** — anything unrelated to food/cooking/desserts is refused.
2. **Multilingual** — replies always match the user's language.

## 📄 License

Academic use for CCIT-06 coursework.
