# ImpostorGPT

A pass-the-phone party game where players take turns revealing their roles. One player is the impostor who doesn't know the word, while others try to figure out who it is.

## Features

- 🎮 Pass-the-phone gameplay
- 🎯 Built-in categories (Basketball Players, UW Buildings, Tech Companies)
- ✨ AI-generated custom categories using Google Gemini
- 📱 Mobile-first, glassy UI design
- 💾 Session-based storage for custom categories

## Tech Stack

- **Frontend**: React + Vite + Tailwind CSS + React Router
- **Backend**: Node.js + Express + Google Gemini API
- **Deployment**: Vercel

## Setup

### Prerequisites

- Node.js 18+ and npm
- Google Gemini API key

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd one-word-impostor
```

2. Install dependencies:
```bash
npm run install:all
```

3. Set up environment variables:
```bash
cd backend
cp .env.example .env
```

Edit `backend/.env` and add your Gemini API key:
```
GEMINI_API_KEY=your_api_key_here
PORT=3001
```

### Development

Run both frontend and backend:
```bash
npm run dev
```

Or run separately:
```bash
# Frontend (port 3000)
cd frontend && npm run dev

# Backend (port 3001)
cd backend && npm run dev
```

### Building

Build the frontend for production:
```bash
npm run build
```

## Deployment to Vercel

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

3. Add environment variables in Vercel dashboard:
   - `GEMINI_API_KEY`: Your Google Gemini API key

The `vercel.json` configuration handles:
- Frontend static build
- Backend serverless function at `/generate-category`
- SPA routing for React Router

## Project Structure

```
one-word-impostor/
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── context/        # React Context for game state
│   │   ├── data/           # Built-in categories
│   │   ├── pages/          # Page components
│   │   ├── utils/          # Utilities (sessionStorage)
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── backend/
│   ├── api/                # Vercel serverless functions
│   ├── server.js           # Express server (dev)
│   └── package.json
├── package.json            # Root workspace config
└── vercel.json            # Vercel deployment config
```

## Game Flow

1. **Home**: Choose to start a game or create a category
2. **Start Game**: Select number of players, category, and optional impostor hint
3. **Role Reveal**: Pass the phone - each player taps to see their role
4. **Round End**: Shows who goes first, option to restart or pick new category

## Built-in Categories

- **Basketball Players**: 40 NBA players with subtle hints
- **UW Buildings**: 40 University of Washington buildings
- **Tech Companies**: 40 technology companies

## Custom Categories

Users can create custom categories by providing a category name. The backend uses Google Gemini AI to generate 30-40 items with subtle hints. Custom categories are stored in sessionStorage and persist for the session.

## License

MIT
