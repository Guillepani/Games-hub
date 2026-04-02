export const getStoredValue = (key, defaultValue = 0) => {
  const saved = localStorage.getItem(key)
  if (saved === null) return defaultValue
  try {
    return JSON.parse(saved)
  } catch {
    return defaultValue
  }
}

export const setStoredValue = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value))
}

export const removeStoredValue = (key) => {
  localStorage.removeItem(key)
}
