import { useState, useEffect } from 'react'
import { Language, I18nKey, i18n } from '@/lib/i18n'
import { STORAGE_KEYS } from '@/types'
import { getFromStorage, saveToStorage } from '@/lib/utils'

export function useI18n() {
  const [currentLang, setCurrentLang] = useState<Language>('zh')

  // Load language from storage on mount
  useEffect(() => {
    const stored = getFromStorage(STORAGE_KEYS.LANG) as Language
    if (stored && (stored === 'zh' || stored === 'en')) {
      setCurrentLang(stored)
    }
  }, [])

  const t = (key: I18nKey): string => {
    return i18n[currentLang]?.[key] || key
  }

  const toggleLang = () => {
    const newLang: Language = currentLang === 'en' ? 'zh' : 'en'
    setCurrentLang(newLang)
    saveToStorage(STORAGE_KEYS.LANG, newLang)
  }

  return {
    currentLang,
    t,
    toggleLang
  }
}
