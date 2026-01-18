import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useGame } from '../context/GameContext'
import { builtInCategories } from '../data/categories'
import CategorySelect from '../components/CategorySelect'

export default function StartGame() {
  const navigate = useNavigate()
  const location = useLocation()
  const { startGame } = useGame()
  const [numPlayers, setNumPlayers] = useState(4)
  const [selectedCategory, setSelectedCategory] = useState('')
  const [giveHint, setGiveHint] = useState(false)
  const [allCategories, setAllCategories] = useState([])
  const [playerNames, setPlayerNames] = useState(['', '', '', ''])
  const [nameErrors, setNameErrors] = useState([])

  useEffect(() => {
    const builtIn = builtInCategories.map(c => ({ name: c.name, type: 'builtin' }))
    setAllCategories(builtIn)
    
    // Check if category was pre-selected from Home page
    if (location.state?.selectedCategory) {
      const categoryKey = location.state.selectedCategory
      setSelectedCategory(categoryKey)
    }
    
    // Check if custom category was created (from CreateCategory page)
    if (location.state?.customCategory) {
      // Pre-select the custom category (it won't be in the dropdown, but we'll use it directly)
      setSelectedCategory('__custom__')
    }
  }, [location.state])

  useEffect(() => {
    // Update player names array when numPlayers changes
    const newNames = Array.from({ length: numPlayers }, (_, i) => playerNames[i] || '')
    setPlayerNames(newNames)
    setNameErrors(Array(numPlayers).fill(false))
  }, [numPlayers])

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Validate all player names are filled
    const trimmedNames = playerNames.map(name => name.trim())
    const errors = trimmedNames.map(name => !name)
    setNameErrors(errors)
    
    if (errors.some(error => error)) {
      return
    }
    
    // Check if we have a custom category from CreateCategory page
    if (location.state?.customCategory) {
      // Use the custom category directly without saving it
      startGame(numPlayers, location.state.customCategory.name, giveHint, trimmedNames, location.state.customCategory.items)
    } else if (selectedCategory && selectedCategory !== '__custom__') {
      // Use a built-in category
      startGame(numPlayers, selectedCategory, giveHint, trimmedNames)
    } else {
      // No category selected
      return
    }
    
    navigate('/reveal')
  }

  const handlePlayerNameChange = (index, value) => {
    const newNames = [...playerNames]
    newNames[index] = value
    setPlayerNames(newNames)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-black relative z-10">
      <div className="glass-card rounded-3xl shadow-2xl p-8 md:p-12 max-w-md w-full">
        <h2 className="text-4xl font-bold text-white mb-8 text-center glow-text">
          Start Game
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-white text-xl font-semibold mb-3">
              Number of Players
            </label>
            <input
              type="number"
              min="3"
              max="10"
              value={numPlayers}
              onChange={(e) => {
                const value = e.target.value
                if (value === '') {
                  // Don't update if empty, keep current value
                  return
                }
                const numValue = parseInt(value)
                if (!isNaN(numValue) && numValue >= 3 && numValue <= 10) {
                  setNumPlayers(numValue)
                }
              }}
              className="w-full glass-card text-white text-2xl font-semibold py-4 px-6 rounded-2xl border-2 border-white/20 focus:outline-none focus:border-white/40 focus:ring-2 focus:ring-[#FDB927]/30 transition-all"
            />
          </div>

          <div className="space-y-3">
            <label className="block text-white text-xl font-semibold mb-3">
              Player Names <span className="text-white/50 text-lg">(Required)</span>
            </label>
            {playerNames.map((name, index) => (
              <div key={index}>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => {
                    handlePlayerNameChange(index, e.target.value)
                    // Clear error when user starts typing
                    if (nameErrors[index]) {
                      const newErrors = [...nameErrors]
                      newErrors[index] = false
                      setNameErrors(newErrors)
                    }
                  }}
                  placeholder={`Player ${index + 1} name`}
                  className={`w-full bg-white/5 backdrop-blur-sm text-white text-xl font-semibold py-3 px-6 rounded-2xl border-2 focus:outline-none focus:border-white/30 placeholder-white/30 ${
                    nameErrors[index] ? 'border-red-500/50' : 'border-white/10'
                  }`}
                />
                {nameErrors[index] && (
                  <p className="text-red-400 text-sm mt-1 ml-2">Name is required</p>
                )}
              </div>
            ))}
          </div>
          
          <div>
            <label className="block text-white text-xl font-semibold mb-3">
              Category
            </label>
            {location.state?.customCategory ? (
              <div className="w-full glass-card text-white text-xl font-semibold py-4 px-6 rounded-2xl border-2 border-[#FDB927]/30">
                {location.state.customCategory.name}
                <span className="text-white/50 text-sm ml-2">(Custom - not saved)</span>
              </div>
            ) : (
              <CategorySelect
                categories={allCategories}
                value={selectedCategory}
                onChange={setSelectedCategory}
              />
            )}
          </div>

          <div className="flex items-center space-x-4">
            <input
              type="checkbox"
              id="hint"
              checked={giveHint}
              onChange={(e) => setGiveHint(e.target.checked)}
              className="w-6 h-6 rounded accent-white"
            />
            <label htmlFor="hint" className="text-white text-xl font-semibold">
              Give impostor hint
            </label>
          </div>

          <button
            type="submit"
            className="btn-glow w-full bg-gradient-to-r from-[#FDB927]/30 to-[#FF6B35]/30 hover:from-[#FDB927]/40 hover:to-[#FF6B35]/40 backdrop-blur-xl border-2 border-[#FDB927]/40 text-white text-2xl font-semibold py-6 px-8 rounded-2xl transition-all shadow-lg hover:shadow-2xl hover:shadow-[#FDB927]/30 hover:scale-[1.02] relative overflow-hidden"
          >
            Start
          </button>
        </form>
        <button
          onClick={() => navigate('/')}
          className="btn-glow w-full mt-4 glass-card text-white text-xl font-semibold py-4 px-8 rounded-2xl transition-all hover:scale-[1.02]"
        >
          Back to Categories
        </button>
      </div>
    </div>
  )
}

