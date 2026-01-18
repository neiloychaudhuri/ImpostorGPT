import { useState, useEffect, useRef } from 'react'
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
  const [isFlipping, setIsFlipping] = useState(false)
  const touchStartRef = useRef(false)

  // Reset reveal state when player changes
  useEffect(() => {
    setRoleRevealed(false)
    setIsFlipping(false)
    touchStartRef.current = false
  }, [currentPlayerIndex])

  const isImpostor = currentPlayerIndex === impostorIndex
  const currentPlayer = players[currentPlayerIndex]
  const isLastPlayer = currentPlayerIndex === players.length - 1

  const handleRevealStart = (e) => {
    // Prevent default to avoid text selection and other touch behaviors
    if (e.type === 'touchstart') {
      e.preventDefault()
    }
    if (!touchStartRef.current) {
      touchStartRef.current = true
      setIsFlipping(true)
      setRoleRevealed(true)
    }
  }

  const handleRevealEnd = (e) => {
    // Prevent default
    if (e.type === 'touchend' || e.type === 'touchcancel') {
      e.preventDefault()
    }
    touchStartRef.current = false
    setIsFlipping(false)
    setRoleRevealed(false)
  }

  const handleNext = () => {
    if (isLastPlayer) {
      finishReveal()
      navigate('/end')
    } else {
      setRoleRevealed(false)
      setIsFlipping(false)
      nextPlayer()
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-black relative z-10" style={{ userSelect: 'none', WebkitUserSelect: 'none', WebkitTouchCallout: 'none' }}>
      <div className="glass-card rounded-3xl shadow-2xl p-8 md:p-12 max-w-md w-full text-center">
        <h2 className="text-3xl font-bold text-white mb-8 glow-text">
          {currentPlayer}
        </h2>
        
        <div className="relative mb-8 min-h-[200px]">
          <div className={`card-container ${isFlipping ? 'flipped' : ''}`}>
            {/* Front of card */}
            <div 
              className="card-face card-front bg-white/5 backdrop-blur-md rounded-2xl p-8 flex items-center justify-center border border-white/10 cursor-pointer"
              onMouseDown={handleRevealStart}
              onMouseUp={handleRevealEnd}
              onMouseLeave={handleRevealEnd}
              onTouchStart={handleRevealStart}
              onTouchEnd={handleRevealEnd}
              onTouchCancel={handleRevealEnd}
              style={{ touchAction: 'none' }}
            >
              <div className="text-center">
                <p className="text-2xl text-white/80 mb-4">
                  Hold the card down to see your role
                </p>
                <p className="text-lg text-white/60">
                  (Hold anywhere on card)
                </p>
              </div>
            </div>
            
            {/* Back of card */}
            <div className="card-face card-back bg-white/5 backdrop-blur-md rounded-2xl p-8 flex items-center justify-center border border-white/10">
              {isImpostor ? (
                <div>
                  <p className="text-4xl font-bold text-white mb-4">
                    You are the <span className="text-red-500">impostor</span>
                  </p>
                  {giveImpostorHint && currentHint && (
                    <p className="text-2xl text-white/70 italic">
                      {currentHint}
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-5xl font-bold text-white">
                  {currentWord}
                </p>
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
