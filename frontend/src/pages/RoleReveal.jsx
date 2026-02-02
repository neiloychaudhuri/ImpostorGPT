import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGame } from '../context/GameContext'

export default function RoleReveal() {
  const navigate = useNavigate()
  const {
    players,
    currentPlayerIndex,
    impostorIndex,
    currentWord,
    currentHint,
    giveImpostorHint,
    nextPlayer,
    finishReveal,
  } = useGame()

  const [roleRevealed, setRoleRevealed] = useState(false)

  // Reset reveal state when player changes
  useEffect(() => {
    setRoleRevealed(false)
  }, [currentPlayerIndex])

  const isImpostor = currentPlayerIndex === impostorIndex
  const currentPlayer = players[currentPlayerIndex]
  const isLastPlayer = currentPlayerIndex === players.length - 1

  const handleToggleReveal = () => {
    setRoleRevealed(!roleRevealed)
  }

  const handleNext = () => {
    if (isLastPlayer) {
      finishReveal()
      navigate('/end')
    } else {
      setRoleRevealed(false)
      nextPlayer()
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-black relative z-10" style={{ userSelect: 'none', WebkitUserSelect: 'none', WebkitTouchCallout: 'none' }}>
      <div className="glass-card rounded-3xl shadow-2xl p-8 md:p-12 max-w-md w-full text-center">
        <h2 className="text-3xl font-bold text-white mb-8 glow-text">
          {currentPlayer}
        </h2>
        
        <div className="relative mb-8 min-h-[400px]">
          <div className={`card-container ${roleRevealed ? 'flipped' : ''}`}>
            {/* Front of card */}
            <div className="card-face card-front bg-white/5 backdrop-blur-md rounded-2xl p-8 md:p-10 flex flex-col items-center justify-center border border-white/10 relative">
              <div className="text-center mb-6">
                <p className="text-2xl text-white/80 mb-2">
                  Press the button to see your role
                </p>
              </div>
              <button
                onClick={handleToggleReveal}
                className="bg-white text-black px-6 py-3 rounded-xl font-semibold text-lg hover:bg-white/90 transition-all shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
              >
                Reveal Role
              </button>
            </div>
            
            {/* Back of card */}
            <div className="card-face card-back bg-white/5 backdrop-blur-md rounded-2xl p-8 md:p-10 flex flex-col items-center justify-center border border-white/10 relative">
              {isImpostor ? (
                <div className="text-center w-full flex flex-col items-center justify-center space-y-8 py-4">
                  <p className="text-4xl font-bold text-white">
                    You are the <span className="text-red-500">impostor</span>
                  </p>
                  {giveImpostorHint && currentHint && (
                    <p className="text-2xl text-white/70 italic px-4">
                      {currentHint}
                    </p>
                  )}
                  <button
                    onClick={handleToggleReveal}
                    className="bg-white text-black px-6 py-3 rounded-xl font-semibold text-lg hover:bg-white/90 transition-all shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 mt-2"
                  >
                    Hide Role
                  </button>
                </div>
              ) : (
                <div className="text-center w-full flex flex-col items-center justify-center space-y-8 py-4">
                  <p className="text-5xl font-bold text-white">
                    {currentWord}
                  </p>
                  <button
                    onClick={handleToggleReveal}
                    className="bg-white text-black px-6 py-3 rounded-xl font-semibold text-lg hover:bg-white/90 transition-all shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
                  >
                    Hide Role
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <button
          onClick={handleNext}
          className="btn-glow w-full bg-gradient-to-r from-[#FDB927]/30 to-[#FF6B35]/30 hover:from-[#FDB927]/40 hover:to-[#FF6B35]/40 backdrop-blur-xl border-2 border-[#FDB927]/40 text-white text-2xl font-semibold py-6 px-8 rounded-2xl transition-all shadow-lg hover:shadow-2xl hover:shadow-[#FDB927]/30 hover:scale-[1.02] relative overflow-hidden"
        >
          {isLastPlayer ? 'Finish' : 'Next Player'}
        </button>
      </div>
    </div>
  )
}
