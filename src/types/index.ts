export interface VaultItem {
  id: string
  title: string
  user: string
  pass: string
  note: string
  category: Category
  hidden: boolean
}

export type Category = 'social' | 'email' | 'finance' | 'shopping' | 'work' | 'server' | 'other'

export type SortOrder = 'newest' | 'oldest' | 'name'

export type Screen = 'setup' | 'login' | 'mandatorySetup' | 'app'

export type BackupFrequency = 'daily' | 'weekly' | 'monthly' | 'manual'

export interface BackupData {
  version: string
  timestamp: string
  verifier: string
  data: string
}

export const STORAGE_KEYS = {
  DATA: 'vault_data_v3',
  VERIFIER: 'vault_verifier_v3',
  RECOVERY: 'vault_recovery_v3',
  QUESTION: 'vault_question_v3',
  EMAIL: 'vault_email_v3',
  CREATED: 'vault_created_at',
  THEME: 'vault_theme',
  LANG: 'vault_lang',
  BACKUP_FREQ: 'vault_backup_freq',
  LAST_BACKUP: 'vault_last_backup',
  MANDATORY_DONE: 'vault_mandatory_done'
} as const
