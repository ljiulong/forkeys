import { useState, useEffect } from 'react'
import { STORAGE_KEYS } from '@/types'
import { getFromStorage, saveToStorage } from '@/lib/utils'

export type Theme = 'light' | 'dark'

export function useTheme() {
  const [theme, setTheme] = useState<Theme>('light')

  // Load theme from storage on mount
  useEffect(() => {
    const stored = getFromStorage(STORAGE_KEYS.THEME) as Theme
    if (stored) {
      setTheme(stored)
      applyTheme(stored)
    }
  }, [])

  const applyTheme = (newTheme: Theme) => {
    if (typeof window !== 'undefined') {
      document.body.classList.toggle('dark-mode', newTheme === 'dark')
      const metaTheme = document.querySelector('meta[name="theme-color"]')
      if (metaTheme) {
        metaTheme.setAttribute('content', newTheme === 'dark' ? '#0f172a' : '#f8fafc')
      }
    }
  }

  const toggleTheme = () => {
    const newTheme: Theme = theme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
    saveToStorage(STORAGE_KEYS.THEME, newTheme)
    applyTheme(newTheme)
  }

  return {
    theme,
    toggleTheme
  }
}
