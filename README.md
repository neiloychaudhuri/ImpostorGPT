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
git clone https://github.com/neiloychaudhuri/ImpostorGPT.git
cd ImpostorGPT
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
- Frontend static build (outputs to `dist/`)
- Backend serverless function at `/api/generate-category`
- SPA routing for React Router

**Note**: The build command uses npm workspaces to build the frontend workspace.

## Project Structure

```
ImpostorGPT/
├── api/
│   └── generate-category.js  # Vercel serverless function
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── context/        # React Context for game state
│   │   ├── data/           # Built-in categories
│   │   ├── pages/          # Page components
│   │   ├── utils/          # Utilities (sessionStorage)
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/
│   │   └── magnifying-glass.svg  # Favicon
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── backend/
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

ImpostorGPT includes 24 built-in categories with subtle hints:

- **Basketball Players** - NBA stars and legends
- **UWaterloo Buildings** - University of Waterloo campus buildings
- **Tech Companies** - Major technology companies
- **Movie Characters** - Iconic film characters
- **Superheroes** - Marvel and DC heroes
- **Famous Musicians** - Legendary artists and bands
- **Video Game Characters** - Beloved gaming icons
- **Famous Landmarks** - World-renowned structures
- **Food & Drinks** - International cuisine and beverages
- **Animals** - Wildlife from around the world
- **Countries** - Nations and their characteristics
- **TV Shows** - Popular television series
- **Sports** - Various athletic activities
- **Famous Authors** - Literary greats
- **Cartoon Characters** - Animated favorites
- **Famous Scientists** - Pioneers of science
- **Fashion Brands** - Iconic clothing labels
- **Cars** - Automotive manufacturers
- **Social Media Platforms** - Digital networks
- **Disney Characters** - Disney favorites
- **Marvel Characters** - Marvel universe heroes and villains
- **Pokemon** - Pocket monsters
- **Famous Paintings** - Masterpieces of art
- **Famous Historical Figures** - Influential people from history

## Custom Categories

Users can create custom categories by providing a category name. The backend uses Google Gemini AI (gemini-2.5-flash model) to generate 30-40 items with subtle hints. Custom categories are used immediately and don't need to be saved - they're passed directly to the game.

## Features Details

- **Mobile-Optimized**: Touch-friendly interface with text selection disabled for better mobile experience
- **Loading States**: Visual feedback during category generation
- **Player Management**: Plus/minus buttons for adjusting player count (3-10 players)
- **Custom Branding**: Magnifying glass favicon and "ImpostorGPT" browser title

## License

MIT
