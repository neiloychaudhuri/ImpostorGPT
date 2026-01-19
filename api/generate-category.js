// Vercel serverless function
import { GoogleGenerativeAI } from '@google/generative-ai'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { category } = req.body

    if (!category) {
      return res.status(400).json({ error: 'Category name is required' })
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: 'Gemini API key not configured' })
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
    
    // Use gemini-2.5-flash as primary (most reliable and available)
    // Fallback to other models if needed
    const prompt = `Generate 30-40 extremely well-known items for the category "${category}". For each item, provide a subtle hint (1-3 words) that gently nudges at the word but never gives it away directly. The hints should be vague and require some thought. Return ONLY a valid JSON array in this exact format: [{"word": "Item Name", "hint": "subtle hint"}, ...]. Do not include any other text, explanations, or markdown formatting.`

    // Try models in order of preference
    const modelsToTry = ['gemini-2.5-flash', 'gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-pro']
    let result = null
    let lastError = null
    
    for (const modelName of modelsToTry) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName })
        result = await model.generateContent(prompt)
        break
      } catch (error) {
        lastError = error
        continue
      }
    }
    
    if (!result) {
      throw new Error(`Failed to generate content with any available model. Last error: ${lastError?.message || 'Unknown error'}`)
    }
    const response = await result.response
    const text = response.text()

    // Try to extract JSON from the response
    let jsonText = text.trim()
    
    // Remove markdown code blocks if present
    if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    }

    // Parse the JSON
    let items
    try {
      items = JSON.parse(jsonText)
    } catch (parseError) {
      // If parsing fails, try to extract JSON array from the text
      const jsonMatch = jsonText.match(/\[[\s\S]*\]/)
      if (jsonMatch) {
        items = JSON.parse(jsonMatch[0])
      } else {
        throw new Error('Failed to parse JSON from response')
      }
    }

    // Validate the structure
    if (!Array.isArray(items)) {
      throw new Error('Response is not an array')
    }

    // Ensure each item has word and hint
    const validItems = items
      .filter(item => item.word && item.hint)
      .map(item => ({
        word: String(item.word).trim(),
        hint: String(item.hint).trim()
      }))

    if (validItems.length < 10) {
      throw new Error('Not enough valid items generated')
    }

    res.status(200).json({ items: validItems })
  } catch (error) {
    console.error('Error generating category:', error)
    res.status(500).json({ error: 'Failed to generate category', details: error.message })
  }
}

