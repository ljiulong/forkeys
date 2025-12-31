import CryptoJS from 'crypto-js'
import { VaultItem } from '@/types'

export function escapeHtml(text: string): string {
  const div = document.createElement('div')
  div.textContent = text || ''
  return div.innerHTML
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(text)
      return true
    } else {
      // Fallback for older browsers
      const ta = document.createElement('textarea')
      ta.value = text
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
      return true
    }
  } catch (error) {
    console.error('Failed to copy:', error)
    return false
  }
}

export function generatePassword(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*'
  let pass = ''
  for (let i = 0; i < 16; i++) {
    pass += chars[Math.floor(Math.random() * chars.length)]
  }
  return pass
}

export function encryptData(data: string, password: string): string {
  return CryptoJS.AES.encrypt(data, password).toString()
}

export function decryptData(encryptedData: string, password: string): string {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, password)
    return bytes.toString(CryptoJS.enc.Utf8)
  } catch (error) {
    throw new Error('Decryption failed')
  }
}

export function verifyPassword(password: string, verifier: string): boolean {
  try {
    const decrypted = decryptData(verifier, password)
    return decrypted === 'VERIFIED_OK'
  } catch {
    return false
  }
}

export function saveToStorage(key: string, value: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, value)
  }
}

export function getFromStorage(key: string): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(key)
  }
  return null
}

export function removeFromStorage(key: string): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(key)
  }
}

export function downloadFile(content: string, filename: string, type: string = 'application/json'): void {
  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export function formatDate(timestamp: number): string {
  const date = new Date(timestamp)
  return date.toLocaleDateString()
}

export function getDaysAgo(timestamp: number): number {
  return Math.floor((Date.now() - timestamp) / (24 * 60 * 60 * 1000))
}
