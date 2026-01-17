import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { builtInCategories } from '../data/categories'

export default function Home() {
  const navigate = useNavigate()
  const [allCategories, setAllCategories] = useState([])
  const [selectedCategoryId, setSelectedCategoryId] = useState(null)

  useEffect(() => {
    // Only show built-in categories (custom categories are temporary and not saved)
    const builtIn = builtInCategories.map(c => ({ name: c.name, type: 'builtin' }))
    setAllCategories(builtIn)
  }, [])

  const handleCategorySelect = (categoryName, categoryType, categoryId, event) => {
    // Trigger animation
    setSelectedCategoryId(categoryId)
    
    // Create ripple effect at click position
    if (event) {
      const button = event.currentTarget
      const rect = button.getBoundingClientRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top
      
      const ripple = document.createElement('span')
      ripple.className = 'ripple-effect'
      ripple.style.left = `${x}px`
      ripple.style.top = `${y}px`
      button.appendChild(ripple)
      
      setTimeout(() => {
        ripple.remove()
      }, 600)
    }
    
    // Navigate after animation
    setTimeout(() => {
      if (categoryType === 'create') {
        navigate('/create-category')
      } else {
        // Navigate to start game with category pre-selected via state
        navigate('/start', { state: { selectedCategory: categoryName } })
      }
    }, 300)
  }

  return (
    <div className="min-h-screen p-4 bg-black relative z-10">
      <div className="max-w-4xl mx-auto">
        <div className="glass-card rounded-3xl shadow-2xl p-8 md:p-12 text-center mb-6 relative overflow-hidden space-container">
          {/* Sparkling stars */}
          {[...Array(30)].map((_, i) => (
            <div
              key={`star-${i}`}
              className="sparkle-star"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${1 + Math.random() * 2}s`
              }}
            ></div>
          ))}
          
          {/* Moons */}
          <div className="moon moon-1"></div>
          <div className="moon moon-2"></div>
          <div className="moon moon-3"></div>
          
          {/* Planets */}
          <div className="planet planet-1"></div>
          <div className="planet planet-2"></div>
          <div className="planet planet-3"></div>
          
          <h1 className="text-5xl md:text-6xl text-white mb-8 glow-text relative z-10">
            <span className="font-normal">Impostor</span><span className="font-bold bg-gradient-to-r from-[#FDB927] to-[#FF6B35] bg-clip-text text-transparent">GPT</span>
          </h1>
          <h2 className="text-2xl font-semibold text-white/90 mb-6 relative z-10">
            Choose a Category
          </h2>
          <div className="flex flex-col items-center justify-center gap-2 relative z-10">
            <p className="text-sm md:text-base text-white/70 font-light">
              Built by Neiloy Chaudhuri
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://www.linkedin.com/in/neiloyc/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/70 hover:text-[#FDB927] transition-colors duration-300"
                aria-label="LinkedIn Profile"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a
                href="https://x.com/_neiloy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/70 hover:text-[#FDB927] transition-colors duration-300"
                aria-label="X Profile"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
        
        {/* Special "Create Your Own" button at the top */}
        <div className="mt-6 mb-4">
          <button
            onClick={(e) => handleCategorySelect('', 'create', 'create-category', e)}
            className={`category-button btn-glow lightspeed-button w-full bg-gradient-to-r from-[#FDB927]/30 via-[#FDB927]/20 to-[#FF6B35]/20 backdrop-blur-xl border-2 border-[#FDB927]/50 text-white text-2xl font-bold py-6 px-8 rounded-3xl transition-all hover:from-[#FDB927]/40 hover:via-[#FDB927]/30 hover:to-[#FF6B35]/30 hover:backdrop-blur-2xl hover:border-[#FDB927]/70 hover:shadow-2xl hover:shadow-[#FDB927]/30 hover:scale-[1.02] relative overflow-hidden ${
              selectedCategoryId === 'create-category' ? 'category-selected' : ''
            }`}
            style={{
              boxShadow: '0 8px 32px rgba(253, 185, 39, 0.2), 0 0 0 1px rgba(253, 185, 39, 0.1) inset'
            }}
          >
            <span className="relative z-10">Create Your Own</span>
            <div className="lightspeed-lines"></div>
          </button>
        </div>
        
        {/* Regular categories grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {allCategories.map((cat, index) => {
            const categoryId = `${cat.type}-${cat.name}-${index}`
            const isSelected = selectedCategoryId === categoryId
            return (
              <button
                key={categoryId}
                onClick={(e) => handleCategorySelect(cat.name, cat.type, categoryId, e)}
                className={`category-button btn-glow w-full glass-card text-white text-xl font-semibold py-4 px-6 rounded-2xl transition-all hover:scale-[1.02] relative overflow-hidden ${
                  isSelected ? 'category-selected' : ''
                }`}
              >
                {cat.name}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

