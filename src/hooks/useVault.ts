import { useState, useEffect, useCallback } from 'react'
import { VaultItem, STORAGE_KEYS, BackupData, BackupFrequency } from '@/types'
import {
  encryptData,
  decryptData,
  verifyPassword,
  saveToStorage,
  getFromStorage,
  downloadFile
} from '@/lib/utils'
import CryptoJS from 'crypto-js'

export function useVault() {
  const [masterKey, setMasterKey] = useState<string>('')
  const [vaultData, setVaultData] = useState<VaultItem[]>([])
  const [isUnlocked, setIsUnlocked] = useState(false)

  // Load vault data from storage
  const loadData = useCallback((password: string) => {
    const enc = getFromStorage(STORAGE_KEYS.DATA)
    if (enc) {
      try {
        const decrypted = decryptData(enc, password)
        const data = JSON.parse(decrypted) || []
        setVaultData(data)
      } catch {
        setVaultData([])
      }
    }
  }, [])

  // Save vault data to storage
  const saveVault = useCallback(() => {
    if (!masterKey) return
    const encrypted = encryptData(JSON.stringify(vaultData), masterKey)
    saveToStorage(STORAGE_KEYS.DATA, encrypted)
  }, [masterKey, vaultData])

  // Auto-save when vaultData changes
  useEffect(() => {
    if (isUnlocked && masterKey) {
      saveVault()
    }
  }, [vaultData, isUnlocked, masterKey, saveVault])

  // Create new vault
  const createVault = useCallback((password: string, confirmPassword: string) => {
    if (!password) {
      throw new Error('passNull')
    }
    if (password.length < 4) {
      throw new Error('passShort')
    }
    if (password !== confirmPassword) {
      throw new Error('passMismatch')
    }

    const verifier = CryptoJS.AES.encrypt('VERIFIED_OK', password).toString()
    saveToStorage(STORAGE_KEYS.VERIFIER, verifier)
    saveToStorage(STORAGE_KEYS.CREATED, Date.now().toString())
    saveToStorage(STORAGE_KEYS.DATA, '')
    saveToStorage(STORAGE_KEYS.BACKUP_FREQ, 'weekly')

    setMasterKey(password)
    setVaultData([])
    return true
  }, [])

  // Unlock vault
  const unlockVault = useCallback((password: string) => {
    const verifier = getFromStorage(STORAGE_KEYS.VERIFIER)
    if (!verifier) {
      throw new Error('No vault found')
    }

    if (!verifyPassword(password, verifier)) {
      throw new Error('accessDenied')
    }

    setMasterKey(password)
    loadData(password)
    setIsUnlocked(true)
    return true
  }, [loadData])

  // Lock vault
  const lockVault = useCallback(() => {
    setMasterKey('')
    setVaultData([])
    setIsUnlocked(false)
  }, [])

  // Add or update item
  const saveItem = useCallback((item: VaultItem) => {
    setVaultData(prev => {
      const index = prev.findIndex(i => i.id === item.id)
      if (index !== -1) {
        const newData = [...prev]
        newData[index] = item
        return newData
      } else {
        return [item, ...prev]
      }
    })
  }, [])

  // Delete item
  const deleteItem = useCallback((id: string) => {
    setVaultData(prev => prev.filter(i => i.id !== id))
  }, [])

  // Delete all data
  const deleteAllData = useCallback(() => {
    setVaultData([])
    saveToStorage(STORAGE_KEYS.DATA, '')
  }, [])

  // Change master password
  const changePassword = useCallback((currentPassword: string, newPassword: string, confirmPassword: string) => {
    if (currentPassword !== masterKey) {
      throw new Error('currentPasswordWrong')
    }
    if (!newPassword || newPassword.length < 4) {
      throw new Error('passShort')
    }
    if (newPassword !== confirmPassword) {
      throw new Error('passMismatch')
    }

    const verifier = CryptoJS.AES.encrypt('VERIFIED_OK', newPassword).toString()
    saveToStorage(STORAGE_KEYS.VERIFIER, verifier)

    setMasterKey(newPassword)
    // Data will be re-encrypted automatically by useEffect
  }, [masterKey])

  // Export data
  const exportData = useCallback(() => {
    const backupData: BackupData = {
      version: '1.0',
      timestamp: new Date().toISOString(),
      verifier: getFromStorage(STORAGE_KEYS.VERIFIER) || '',
      data: getFromStorage(STORAGE_KEYS.DATA) || ''
    }
    const content = JSON.stringify(backupData, null, 2)
    const filename = `forkeys_backup_${new Date().toISOString().split('T')[0]}.json`
    downloadFile(content, filename)
  }, [])

  // Import data
  const importData = useCallback(async (file: File, password: string, mode: 'merge' | 'replace') => {
    return new Promise<void>((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const result = e.target?.result as string
          const backupData: BackupData = JSON.parse(result)

          if (!backupData.version || !backupData.verifier) {
            throw new Error('Invalid backup file')
          }

          if (!verifyPassword(password, backupData.verifier)) {
            throw new Error('accessDenied')
          }

          let items: VaultItem[] = []
          if (backupData.data) {
            const decrypted = decryptData(backupData.data, password)
            items = JSON.parse(decrypted) || []
          }

          if (mode === 'merge') {
            setVaultData(prev => {
              const ids = new Set(prev.map(i => i.id))
              const newItems = items.filter(i => !ids.has(i.id))
              return [...prev, ...newItems]
            })
          } else {
            setVaultData(items)
            if (!masterKey) {
              setMasterKey(password)
              saveToStorage(STORAGE_KEYS.VERIFIER, backupData.verifier)
            }
          }

          resolve()
        } catch (error) {
          reject(error)
        }
      }
      reader.onerror = () => reject(new Error('Failed to read file'))
      reader.readAsText(file)
    })
  }, [masterKey])

  // Auto backup
  const autoBackup = useCallback(() => {
    const backupData: BackupData = {
      version: '1.0',
      timestamp: new Date().toISOString(),
      verifier: getFromStorage(STORAGE_KEYS.VERIFIER) || '',
      data: getFromStorage(STORAGE_KEYS.DATA) || ''
    }
    const content = JSON.stringify(backupData, null, 2)
    const filename = `forkeys_auto_backup_${new Date().toISOString().split('T')[0]}.json`
    downloadFile(content, filename)
    saveToStorage(STORAGE_KEYS.LAST_BACKUP, Date.now().toString())
  }, [])

  // Save security question
  const saveSecurityQuestion = useCallback((question: string, answer: string) => {
    if (!question || !answer) {
      throw new Error('passNull')
    }
    if (!masterKey) {
      throw new Error('Not unlocked')
    }

    saveToStorage(STORAGE_KEYS.QUESTION, question)
    const encrypted = CryptoJS.AES.encrypt(masterKey, answer.toUpperCase().replace(/\s+/g, '')).toString()
    saveToStorage(STORAGE_KEYS.RECOVERY, encrypted)
  }, [masterKey])

  // Recover password
  const recoverPassword = useCallback((answer: string) => {
    const recovery = getFromStorage(STORAGE_KEYS.RECOVERY)
    if (!recovery) {
      throw new Error('No recovery data')
    }

    try {
      const password = CryptoJS.AES.decrypt(recovery, answer.toUpperCase().replace(/\s+/g, '')).toString(CryptoJS.enc.Utf8)
      if (password) {
        return password
      }
      throw new Error('invalidAnswer')
    } catch {
      throw new Error('invalidAnswer')
    }
  }, [])

  return {
    masterKey,
    vaultData,
    isUnlocked,
    createVault,
    unlockVault,
    lockVault,
    saveItem,
    deleteItem,
    deleteAllData,
    changePassword,
    exportData,
    importData,
    autoBackup,
    saveSecurityQuestion,
    recoverPassword
  }
}
