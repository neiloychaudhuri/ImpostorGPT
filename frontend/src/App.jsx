import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { GameProvider } from './context/GameContext'
import Home from './pages/Home'
import StartGame from './pages/StartGame'
import RoleReveal from './pages/RoleReveal'
import RoundEnd from './pages/RoundEnd'
import CreateCategory from './pages/CreateCategory'

function App() {
  return (
    <GameProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/start" element={<StartGame />} />
          <Route path="/reveal" element={<RoleReveal />} />
          <Route path="/end" element={<RoundEnd />} />
          <Route path="/create-category" element={<CreateCategory />} />
        </Routes>
      </Router>
    </GameProvider>
  )
}

export default App

