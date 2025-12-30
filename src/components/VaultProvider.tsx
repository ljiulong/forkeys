'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import { useVault } from '@/hooks/useVault'
import { useTheme } from '@/hooks/useTheme'
import { useI18n } from '@/hooks/useI18n'

interface VaultContextType {
  vault: ReturnType<typeof useVault>
  theme: ReturnType<typeof useTheme>
  i18n: ReturnType<typeof useI18n>
  showToast: (message: string, isError?: boolean) => void
}

const VaultContext = createContext<VaultContextType | undefined>(undefined)

export function VaultProvider({ children }: { children: ReactNode }) {
  const vault = useVault()
  const theme = useTheme()
  const i18n = useI18n()

  const [toast, setToast] = useState<{ message: string; isError: boolean; visible: boolean }>({
    message: '',
    isError: false,
    visible: false
  })

  const showToast = (message: string, isError: boolean = false) => {
    setToast({ message, isError, visible: true })
    setTimeout(() => {
      setToast(prev => ({ ...prev, visible: false }))
    }, 2500)
  }

  return (
    <VaultContext.Provider value={{ vault, theme, i18n, showToast }}>
      {children}
      {/* Toast notification */}
      <div
        className={`fixed top-20 right-4 z-50 transition-all duration-300 ${
          toast.visible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
        }`}
      >
        <div className="vault-panel px-4 py-3 flex items-center gap-2 border-l-4 border-[var(--border-highlight)]">
          <i className={`fas ${toast.isError ? 'fa-times-circle text-red-500' : 'fa-check-circle text-[var(--text-accent)]'}`} />
          <span className="text-sm font-medium">{toast.message}</span>
        </div>
      </div>
    </VaultContext.Provider>
  )
}

export function useVaultContext() {
  const context = useContext(VaultContext)
  if (!context) {
    throw new Error('useVaultContext must be used within VaultProvider')
  }
  return context
}
