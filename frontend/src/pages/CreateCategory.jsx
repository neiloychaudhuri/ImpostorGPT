import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function CreateCategory() {
  const navigate = useNavigate()
  const [categoryName, setCategoryName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!categoryName.trim()) return

    setLoading(true)
    setError('')

    try {
      // Use full URL for localhost development
      const apiUrl = import.meta.env.DEV 
        ? 'http://localhost:3001/generate-category'
        : '/generate-category'
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ category: categoryName }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
        throw new Error(errorData.error || `Server error: ${response.status}`)
      }

      const data = await response.json()
      
      if (!data.items || !Array.isArray(data.items) || data.items.length === 0) {
        throw new Error('Invalid response from server')
      }

      // Navigate directly to StartGame with the category data (don't save it)
      navigate('/start', {
        state: {
          customCategory: {
            name: categoryName,
            items: data.items
          }
        }
      })
    } catch (err) {
      console.error('Category creation error:', err)
      let errorMessage = 'Failed to create category. Please try again.'
      
      if (err.message.includes('fetch')) {
        errorMessage = 'Cannot connect to server. Make sure the backend is running on port 3001.'
      } else if (err.message) {
        errorMessage = err.message
      }
      
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-black relative z-10">
      <div className="glass-card rounded-3xl shadow-2xl p-8 md:p-12 max-w-md w-full relative">
        {loading && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm rounded-3xl flex items-center justify-center z-20">
            <div className="text-center">
              <svg
                className="animate-spin h-12 w-12 text-[#FDB927] mx-auto mb-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <p className="text-white text-xl font-semibold glow-text">Generating category...</p>
              <p className="text-white/70 text-sm mt-2">This may take a few seconds</p>
            </div>
          </div>
        )}
        <h2 className="text-4xl font-bold text-white mb-8 text-center glow-text">
          Create Category
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-white text-xl font-semibold mb-3">
              Category Name
            </label>
            <input
              type="text"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="e.g., Movie Characters"
              className="w-full glass-card text-white text-xl font-semibold py-4 px-6 rounded-2xl border-2 border-white/20 focus:outline-none focus:border-white/40 focus:ring-2 focus:ring-[#FDB927]/30 placeholder-white/30 transition-all"
              disabled={loading}
            />
          </div>

          {error && (
            <div className="bg-red-900/40 backdrop-blur-md text-white p-4 rounded-2xl border border-red-500/30">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !categoryName.trim()}
            className="btn-glow w-full bg-gradient-to-r from-[#FDB927]/30 to-[#FF6B35]/30 hover:from-[#FDB927]/40 hover:to-[#FF6B35]/40 backdrop-blur-xl border-2 border-[#FDB927]/40 disabled:opacity-50 disabled:cursor-not-allowed text-white text-2xl font-semibold py-6 px-8 rounded-2xl transition-all shadow-lg hover:shadow-2xl hover:shadow-[#FDB927]/30 hover:scale-[1.02] relative overflow-hidden flex items-center justify-center gap-3"
          >
            {loading && (
              <svg
                className="animate-spin h-6 w-6 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            )}
            {loading ? 'Generating...' : 'Create Category'}
          </button>
        </form>
        <button
          onClick={() => navigate('/')}
          className="btn-glow w-full mt-4 glass-card text-white text-xl font-semibold py-4 px-8 rounded-2xl transition-all hover:scale-[1.02]"
        >
          Back
        </button>
      </div>
    </div>
  )
}

