import express from 'express'
import cors from 'cors'
import { GoogleGenerativeAI } from '@google/generative-ai'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

app.post('/generate-category', async (req, res) => {
  try {
    const { category } = req.body

    if (!category) {
      return res.status(400).json({ error: 'Category name is required' })
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: 'Gemini API key not configured' })
    }

    // First, list available models to see what we have access to
    let availableModels = []
    try {
      const listResponse = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`
      )
      if (listResponse.ok) {
        const modelsData = await listResponse.json()
        availableModels = modelsData.models?.map(m => m.name.replace('models/', '')) || []
        console.log('Available models:', availableModels)
      }
    } catch (listError) {
      console.log('Could not list models:', listError.message)
    }
    
    // Prioritize models with grounding/web search support for better quality
    // Then fallback to cheaper models
    const preferredModels = [
      'gemini-2.0-flash-exp',    // Best: supports grounding/web search
      'gemini-1.5-pro',          // Supports grounding/web search
      'gemini-2.5-flash',        // Fallback: newest, cheapest, high tokens
      'gemini-flash-latest',     // Fallback: always latest flash
      'gemini-2.0-flash',        // Alternative flash model
      'gemini-2.0-flash-lite'    // Even cheaper lite version
    ]
    
    // Filter to only models that are actually available
    const modelNamesToTry = availableModels.length > 0
      ? preferredModels.filter(m => availableModels.includes(m)).concat(
          availableModels.filter(m => !preferredModels.includes(m) && m.includes('flash'))
        )
      : preferredModels
    
    let modelName = null
    let lastError = null
    
    // Try each model until one works (prioritizing cheapest first)
    for (const name of modelNamesToTry) {
      try {
        const testResponse = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${name}:generateContent?key=${process.env.GEMINI_API_KEY}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{
                parts: [{ text: 'test' }]
              }]
            })
          }
        )
        
        if (testResponse.ok || testResponse.status === 400) {
          // 400 might mean the model exists but the request was bad, which is fine
          modelName = name
          break
        }
      } catch (err) {
        lastError = err
        continue
      }
    }
    
    if (!modelName) {
      // Fallback: try using the SDK
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
      const modelsToTry = ['gemini-2.5-flash', 'gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-pro']
      let model = null
      let lastError = null
      
      for (const modelNameToTry of modelsToTry) {
        try {
          model = genAI.getGenerativeModel({ model: modelNameToTry })
          break
        } catch (error) {
          lastError = error
          continue
        }
      }
      
      if (!model) {
        throw new Error(`No available Gemini models. Last error: ${lastError?.message || 'Unknown'}`)
      }
      
      const prompt = `Generate 30-40 well-known items for the category "${category}". For each item, provide a subtle hint (1-3 words) that gently nudges at the word but never gives it away directly. The hints should be vague and require some thought. Return ONLY a valid JSON array in this exact format: [{"word": "Item Name", "hint": "subtle hint"}, ...]. Do not include any other text, explanations, or markdown formatting.`
      const result = await model.generateContent(prompt)
      const response = await result.response
      const text = response.text()
      
      // Continue with existing parsing logic...
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

      return res.json({ items: validItems })
    }

    // Use REST API directly with the working model
    const prompt = `Generate 30-40 well-known items for the category "${category}". For each item, provide a subtle hint (1-3 words) that gently nudges at the word but never gives it away directly. The hints should be vague and require some thought. Return ONLY a valid JSON array in this exact format: [{"word": "Item Name", "hint": "subtle hint"}, ...]. Do not include any other text, explanations, or markdown formatting.`

    const requestBody = {
      contents: [{
        parts: [{ text: prompt }]
      }]
    }

    const apiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      }
    )

    if (!apiResponse.ok) {
      const errorData = await apiResponse.json()
      throw new Error(`API error: ${errorData.error?.message || 'Unknown error'}`)
    }

    const data = await apiResponse.json()
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || ''

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

    res.json({ items: validItems })
  } catch (error) {
    console.error('Error generating category:', error)
    res.status(500).json({ error: 'Failed to generate category', details: error.message })
  }
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})


