const STORAGE_KEY = 'oneWordImpostor_customCategories'

export function getCustomCategories() {
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error('Error reading custom categories:', error)
    return []
  }
}

export function saveCustomCategory(category) {
  try {
    const existing = getCustomCategories()
    const updated = [...existing, category]
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  } catch (error) {
    console.error('Error saving custom category:', error)
  }
}

