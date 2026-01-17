import { useNavigate } from 'react-router-dom'
import { useGame } from '../context/GameContext'

export default function RoundEnd() {
  const navigate = useNavigate()
  const { firstPlayer, restartGame, category } = useGame()

  const handleRestart = () => {
    restartGame()
    navigate('/reveal')
  }

  const handleNewCategory = () => {
    navigate('/')
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-black relative z-10">
      <div className="glass-card rounded-3xl shadow-2xl p-8 md:p-12 max-w-md w-full text-center">
        <h2 className="text-4xl font-bold text-white mb-8 glow-text">
          Round End
        </h2>
        
        <div className="glass-card rounded-2xl p-6 mb-8 border-2 border-[#FDB927]/30">
          <p className="text-3xl text-white font-semibold">
            <span className="text-[#FDB927] underline decoration-2 underline-offset-4 drop-shadow-[0_0_10px_rgba(253,185,39,0.8)] font-bold">
              {firstPlayer}
            </span>{' '}goes first
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={handleRestart}
            className="btn-glow w-full bg-gradient-to-r from-[#FDB927]/30 to-[#FF6B35]/30 hover:from-[#FDB927]/40 hover:to-[#FF6B35]/40 backdrop-blur-xl border-2 border-[#FDB927]/40 text-white text-2xl font-semibold py-6 px-8 rounded-2xl transition-all shadow-lg hover:shadow-2xl hover:shadow-[#FDB927]/30 hover:scale-[1.02] relative overflow-hidden"
          >
            Restart Same Category
          </button>
          <button
            onClick={handleNewCategory}
            className="btn-glow w-full glass-card text-white text-xl font-semibold py-4 px-8 rounded-2xl transition-all hover:scale-[1.02]"
          >
            Pick New Category
          </button>
        </div>
      </div>
    </div>
  )
}
