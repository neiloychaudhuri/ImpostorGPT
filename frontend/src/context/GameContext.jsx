import { createContext, useContext, useState, useEffect } from 'react'
import { builtInCategories } from '../data/categories'
import { getCustomCategories, saveCustomCategory } from '../utils/storage'

const GameContext = createContext()

export function GameProvider({ children }) {
  const [players, setPlayers] = useState([])
  const [category, setCategory] = useState(null)
  const [categoryData, setCategoryData] = useState([])
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0)
  const [impostorIndex, setImpostorIndex] = useState(null)
  const [currentWord, setCurrentWord] = useState(null)
  const [currentHint, setCurrentHint] = useState(null)
  const [giveImpostorHint, setGiveImpostorHint] = useState(false)
  const [firstPlayer, setFirstPlayer] = useState(null)
  const [customCategories, setCustomCategories] = useState([])

  useEffect(() => {
    setCustomCategories(getCustomCategories())
  }, [])

  const startGame = (numPlayers, selectedCategory, hintEnabled, playerNames, customCategoryData = null) => {
    // Player names are now always required
    const newPlayers = playerNames && playerNames.length === numPlayers
      ? playerNames
      : Array.from({ length: numPlayers }, (_, i) => `Player ${i + 1}`)
    setPlayers(newPlayers)
    setCategory(selectedCategory)
    setGiveImpostorHint(hintEnabled)
    setCurrentPlayerIndex(0)
    setFirstPlayer(null)

    // Get category data
    let data = []
    if (customCategoryData) {
      // Use custom category data passed directly (not saved)
      data = customCategoryData
    } else if (selectedCategory.startsWith('custom:')) {
      const customCats = getCustomCategories()
      const catName = selectedCategory.replace('custom:', '')
      const found = customCats.find(c => c.name === catName)
      if (found) data = found.items
    } else {
      const found = builtInCategories.find(c => c.name === selectedCategory)
      if (found) data = found.items
    }
    setCategoryData(data)

    // Select random word and impostor
    const randomIndex = Math.floor(Math.random() * data.length)
    setCurrentWord(data[randomIndex].word)
    setCurrentHint(data[randomIndex].hint)
    setImpostorIndex(Math.floor(Math.random() * numPlayers))
  }

  const restartGame = () => {
    setCurrentPlayerIndex(0)
    setFirstPlayer(null)
    
    // Select new random word and impostor
    const randomIndex = Math.floor(Math.random() * categoryData.length)
    setCurrentWord(categoryData[randomIndex].word)
    setCurrentHint(categoryData[randomIndex].hint)
    setImpostorIndex(Math.floor(Math.random() * players.length))
  }

  const nextPlayer = () => {
    if (currentPlayerIndex < players.length - 1) {
      setCurrentPlayerIndex(currentPlayerIndex + 1)
    }
  }
  
  const finishReveal = () => {
    // Set first player when all players have seen their roles
    if (firstPlayer === null && players.length > 0) {
      setFirstPlayer(players[0])
    }
  }

  const addCustomCategory = (name, items) => {
    const newCategory = { name, items }
    saveCustomCategory(newCategory)
    setCustomCategories(getCustomCategories())
  }

  return (
    <GameContext.Provider
      value={{
        players,
        category,
        categoryData,
        currentPlayerIndex,
        impostorIndex,
        currentWord,
        currentHint,
        giveImpostorHint,
        firstPlayer,
        customCategories,
        startGame,
        restartGame,
        nextPlayer,
        finishReveal,
        addCustomCategory,
      }}
    >
      {children}
    </GameContext.Provider>
  )
}

export function useGame() {
  const context = useContext(GameContext)
  if (!context) {
    throw new Error('useGame must be used within GameProvider')
  }
  return context
}

