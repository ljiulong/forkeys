'use client'

import { useState, useEffect } from 'react'
import { useVaultContext } from '@/components/VaultProvider'
import { STORAGE_KEYS, VaultItem, Category, SortOrder } from '@/types'
import { getFromStorage, saveToStorage, generatePassword, copyToClipboard, escapeHtml } from '@/lib/utils'

export default function HomePage() {
  const { vault, theme, i18n, showToast } = useVaultContext()
  const { t, currentLang, toggleLang } = i18n

  // Screen state
  const [currentScreen, setCurrentScreen] = useState<'setup' | 'login' | 'mandatorySetup' | 'app'>('login')

  // Setup screen
  const [setupPass, setSetupPass] = useState('')
  const [setupPassConfirm, setSetupPassConfirm] = useState('')

  // Login screen
  const [masterPassword, setMasterPassword] = useState('')
  const [loginError, setLoginError] = useState(false)

  // Mandatory setup
  const [mandatoryQuestion, setMandatoryQuestion] = useState('')
  const [mandatoryAnswer, setMandatoryAnswer] = useState('')
  const [mandatoryEmail, setMandatoryEmail] = useState('')

  // App screen state
  const [searchInput, setSearchInput] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<Category | 'all'>('all')
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest')
  const [showHiddenItems, setShowHiddenItems] = useState(false)

  // Modal states
  const [showViewModal, setShowViewModal] = useState(false)
  const [showItemModal, setShowItemModal] = useState(false)
  const [showSettingsModal, setShowSettingsModal] = useState(false)
  const [showHelpModal, setShowHelpModal] = useState(false)
  const [showRecoveryModal, setShowRecoveryModal] = useState(false)
  const [showEmailRecoveryModal, setShowEmailRecoveryModal] = useState(false)
  const [showBackupReminderModal, setShowBackupReminderModal] = useState(false)

  // Current item being viewed/edited
  const [currentItem, setCurrentItem] = useState<VaultItem | null>(null)
  const [viewPassVisible, setViewPassVisible] = useState(false)

  // Item form
  const [itemForm, setItemForm] = useState<VaultItem>({
    id: '',
    title: '',
    user: '',
    pass: '',
    note: '',
    category: 'other',
    hidden: false
  })
  const [showItemPass, setShowItemPass] = useState(false)

  // Settings
  const [configQuestion, setConfigQuestion] = useState('')
  const [configAnswer, setConfigAnswer] = useState('')
  const [configEmail, setConfigEmail] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')
  const [backupFreq, setBackupFreq] = useState<'daily' | 'weekly' | 'monthly' | 'manual'>('weekly')
  const [lastBackup, setLastBackup] = useState<number>(0)

  // Recovery
  const [inputAnswer, setInputAnswer] = useState('')
  const [recoveryEmail, setRecoveryEmail] = useState('')

  // Accordion states
  const [accordionStates, setAccordionStates] = useState<Record<string, boolean>>({})

  // Initialize
  useEffect(() => {
    const verifier = getFromStorage(STORAGE_KEYS.VERIFIER)
    if (verifier) {
      setCurrentScreen('login')
    } else {
      setCurrentScreen('setup')
    }

    // Load backup frequency
    const freq = getFromStorage(STORAGE_KEYS.BACKUP_FREQ) as any
    if (freq) setBackupFreq(freq)

    const lastB = getFromStorage(STORAGE_KEYS.LAST_BACKUP)
    if (lastB) setLastBackup(parseInt(lastB))
  }, [])

  // Check for backup reminder
  useEffect(() => {
    if (vault.isUnlocked && currentScreen === 'app') {
      setTimeout(() => checkBackupReminder(), 1000)
    }
  }, [vault.isUnlocked, currentScreen])

  const checkBackupReminder = () => {
    if (backupFreq === 'manual') return

    const intervals = {
      daily: 24 * 60 * 60 * 1000,
      weekly: 7 * 24 * 60 * 60 * 1000,
      monthly: 30 * 24 * 60 * 60 * 1000
    }

    const now = Date.now()
    if ((now - lastBackup) > intervals[backupFreq]) {
      setShowBackupReminderModal(true)
    }
  }

  // Setup vault
  const handleCreateVault = async () => {
    try {
      vault.createVault(setupPass, setupPassConfirm)
      showToast(t('dataSaved'))
      setCurrentScreen('mandatorySetup')
    } catch (error: any) {
      showToast(t(error.message), true)
    }
  }

  // Login
  const handleUnlock = async () => {
    try {
      vault.unlockVault(masterPassword)

      const mandatoryDone = getFromStorage(STORAGE_KEYS.MANDATORY_DONE)
      if (!mandatoryDone) {
        setCurrentScreen('mandatorySetup')
      } else {
        setCurrentScreen('app')
      }
      setLoginError(false)
    } catch (error) {
      setLoginError(true)
      setTimeout(() => setLoginError(false), 2000)
    }
  }

  // Mandatory setup
  const handleCompleteMandatorySetup = async () => {
    if (!mandatoryQuestion || !mandatoryAnswer) {
      showToast(t('passNull'), true)
      return
    }
    if (!mandatoryEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mandatoryEmail)) {
      showToast(t('emailInvalid'), true)
      return
    }

    try {
      vault.saveSecurityQuestion(mandatoryQuestion, mandatoryAnswer)
      saveToStorage(STORAGE_KEYS.EMAIL, mandatoryEmail)
      saveToStorage(STORAGE_KEYS.MANDATORY_DONE, 'true')

      // Sync to server
      try {
        await fetch('/api/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: mandatoryEmail,
            question: mandatoryQuestion,
            answer: mandatoryAnswer
          })
        })
      } catch (e) {
        // Server sync failed, but local save succeeded
      }

      showToast(t('dataSaved'))
      setCurrentScreen('app')
    } catch (error: any) {
      showToast(t(error.message), true)
    }
  }

  // Lock vault
  const handleLock = () => {
    vault.lockVault()
    setCurrentScreen('login')
    setMasterPassword('')
  }

  // Filter and sort items
  const getFilteredItems = () => {
    let items = vault.vaultData.filter(item => {
      if (item.hidden && !showHiddenItems) return false
      if (categoryFilter !== 'all' && item.category !== categoryFilter) return false
      const searchLower = searchInput.toLowerCase()
      return item.title.toLowerCase().includes(searchLower) ||
             (item.user || '').toLowerCase().includes(searchLower)
    })

    items.sort((a, b) => {
      if (sortOrder === 'newest') return parseInt(b.id) - parseInt(a.id)
      if (sortOrder === 'oldest') return parseInt(a.id) - parseInt(b.id)
      return a.title.localeCompare(b.title)
    })

    return items
  }

  // Open modals
  const openItemModal = (item?: VaultItem) => {
    if (item) {
      setItemForm(item)
    } else {
      setItemForm({
        id: Date.now().toString(),
        title: '',
        user: '',
        pass: '',
        note: '',
        category: 'other',
        hidden: false
      })
    }
    setShowItemPass(false)
    setShowItemModal(true)
  }

  const openViewModal = (item: VaultItem) => {
    setCurrentItem(item)
    setViewPassVisible(false)
    setShowViewModal(true)
  }

  // Save item
  const handleSaveItem = () => {
    if (!itemForm.title) {
      showToast(t('titleNull'), true)
      return
    }
    vault.saveItem(itemForm)
    setShowItemModal(false)
    showToast(t('dataSaved'))
  }

  // Delete item
  const handleDeleteItem = (id: string) => {
    if (!confirm(t('confirmDelete'))) return
    vault.deleteItem(id)
    setShowViewModal(false)
    setShowItemModal(false)
    showToast(t('dataSaved'))
  }

  // Category icons
  const categoryIcons: Record<Category, string> = {
    social: 'fa-users',
    email: 'fa-envelope',
    finance: 'fa-coins',
    shopping: 'fa-shopping-cart',
    work: 'fa-briefcase',
    server: 'fa-server',
    other: 'fa-folder'
  }

  // Copy to clipboard
  const handleCopy = async (text: string) => {
    const success = await copyToClipboard(text)
    if (success) showToast(t('copied'))
  }

  // Render logo
  const renderLogo = (size: 'sm' | 'md' | 'xs' = 'md') => (
    <svg className={`tech-logo ${size === 'sm' ? 'tech-logo-sm' : size === 'xs' ? 'tech-logo-xs' : ''}`} viewBox={size === 'xs' ? '0 0 24 24' : size === 'sm' ? '0 0 56 56' : '0 0 72 72'}>
      {size === 'xs' ? (
        <>
          <path d="M12 2L4 6v6c0 5.5 3.4 10.6 8 12 4.6-1.4 8-6.5 8-12V6l-8-4z" className="logo-shield" />
          <circle cx="12" cy="10" r="2.5" className="logo-key" />
          <rect x="11" y="11.5" width="2" height="5" rx="0.5" className="logo-key" />
        </>
      ) : size === 'sm' ? (
        <>
          <circle cx="28" cy="28" r="26" className="logo-ring" strokeDasharray="4 2" />
          <path d="M28 8L14 14v12c0 9.4 5.8 18.2 14 20 8.2-1.8 14-10.6 14-20V14L28 8z" className="logo-shield" />
          <circle cx="28" cy="24" r="5" className="logo-key" />
          <rect x="25.5" y="27" width="5" height="12" rx="1.5" className="logo-key" />
          <path d="M14 28H8M42 28h6M28 44v6M28 8V2" className="logo-circuit" />
        </>
      ) : (
        <>
          <circle cx="36" cy="36" r="34" className="logo-ring" strokeDasharray="6 3" />
          <circle cx="36" cy="36" r="28" className="logo-ring" strokeDasharray="4 2" opacity="0.5" />
          <path d="M36 10L18 18v16c0 12 7.2 23.2 18 26 10.8-2.8 18-14 18-26V18L36 10z" className="logo-shield" />
          <circle cx="36" cy="30" r="6" className="logo-key" />
          <rect x="33" y="34" width="6" height="14" rx="2" className="logo-key" />
          <circle cx="36" cy="36" r="22" className="logo-circuit" strokeDasharray="2 4" />
        </>
      )}
    </svg>
  )

  // Setup Screen
  if (currentScreen === 'setup') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="vault-panel p-6 w-full max-w-sm">
          <div className="text-center mb-6">
            <div className="tech-logo tech-logo-sm mx-auto mb-4">
              {renderLogo('sm')}
            </div>
            <h1 className="text-xl font-bold">{t('appName')}</h1>
            <p className="text-sm text-[var(--text-secondary)] mt-1">{t('initConfig')}</p>
          </div>
          <div className="space-y-4">
            <div className="flex justify-end gap-2 mb-2">
              <button onClick={() => setShowHelpModal(true)} className="icon-btn text-sm" title={t('helpTitle')}>
                <i className="fas fa-question-circle" />
              </button>
              <button onClick={theme.toggleTheme} className="icon-btn text-sm" title="主题">
                <i className="fas fa-adjust" />
              </button>
              <button onClick={toggleLang} className="icon-btn text-xs font-bold">
                {currentLang === 'en' ? 'EN' : 'CN'}
              </button>
            </div>
            <div className="tip-box">
              <p>{t('setupTip')}</p>
            </div>
            <input
              type="password"
              value={setupPass}
              onChange={(e) => setSetupPass(e.target.value)}
              className="vault-input"
              placeholder={t('setMasterPass')}
              onKeyPress={(e) => e.key === 'Enter' && handleCreateVault()}
            />
            <input
              type="password"
              value={setupPassConfirm}
              onChange={(e) => setSetupPassConfirm(e.target.value)}
              className="vault-input"
              placeholder={t('confirmPass')}
              onKeyPress={(e) => e.key === 'Enter' && handleCreateVault()}
            />
            <button onClick={handleCreateVault} className="vault-btn primary w-full">
              <i className="fas fa-check" /> {t('executeSetup')}
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Login Screen
  if (currentScreen === 'login') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="vault-panel p-6 w-full max-w-sm text-center">
          <div className="tech-logo mx-auto mb-6">
            {renderLogo()}
          </div>
          <h1 className="text-xl font-bold mb-1">{t('appName')}</h1>
          <p className="text-sm text-[var(--text-secondary)] mb-6">{t('securedBy')}</p>
          <div className="flex justify-center gap-2 mb-4">
            <button onClick={() => setShowHelpModal(true)} className="icon-btn" title={t('helpTitle')}>
              <i className="fas fa-question-circle" />
            </button>
            <button onClick={theme.toggleTheme} className="icon-btn" title="主题">
              <i className="fas fa-adjust" />
            </button>
            <button onClick={toggleLang} className="icon-btn text-xs font-bold">
              {currentLang === 'en' ? 'EN' : 'CN'}
            </button>
          </div>
          <div className="relative mb-4">
            <input
              type="password"
              value={masterPassword}
              onChange={(e) => setMasterPassword(e.target.value)}
              className="vault-input pr-12 text-center"
              placeholder={t('enterPasscode')}
              onKeyPress={(e) => e.key === 'Enter' && handleUnlock()}
            />
          </div>
          <button onClick={handleUnlock} className="vault-btn primary w-full mb-4">
            <i className="fas fa-unlock" /> {t('unlockTerminal')}
          </button>
          <p className={`text-red-500 text-sm transition-opacity mb-2 ${loginError ? 'opacity-100' : 'opacity-0'}`}>
            {t('accessDenied')}
          </p>
          <button
            onClick={() => {
              const question = getFromStorage(STORAGE_KEYS.QUESTION)
              if (!question) {
                alert(t('recoveryNotSet'))
                return
              }
              setShowRecoveryModal(true)
            }}
            className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-accent)]"
          >
            {t('forgotPass')}
          </button>
        </div>
      </div>
    )
  }

  // Mandatory Setup Screen
  if (currentScreen === 'mandatorySetup') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="vault-panel p-6 w-full max-w-md">
          <div className="text-center mb-6">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--bg-input)] flex items-center justify-center">
              <i className="fas fa-shield-alt text-2xl text-[var(--text-accent)]" />
            </div>
            <h1 className="text-xl font-bold">{t('mandatorySetupTitle')}</h1>
            <p className="text-sm text-[var(--text-secondary)] mt-2">{t('mandatorySetupDesc')}</p>
          </div>
          <div className="space-y-4">
            <div className="vault-input bg-[var(--bg-item)] p-4 border-l-4 border-[var(--badge-green-text)]">
              <div className="flex items-center gap-2 mb-3">
                <span className="badge badge-green">1</span>
                <span className="font-semibold">{t('localRecovery')}</span>
                <span className="badge badge-green">{t('offlineTag')}</span>
              </div>
              <input
                type="text"
                value={mandatoryQuestion}
                onChange={(e) => setMandatoryQuestion(e.target.value)}
                className="vault-input mb-2"
                placeholder={t('secQuestionPlaceholder')}
              />
              <input
                type="text"
                value={mandatoryAnswer}
                onChange={(e) => setMandatoryAnswer(e.target.value)}
                className="vault-input"
                placeholder={t('answerPlaceholder')}
              />
            </div>
            <div className="vault-input bg-[var(--bg-item)] p-4 border-l-4 border-[var(--badge-blue-text)]">
              <div className="flex items-center gap-2 mb-3">
                <span className="badge badge-blue">2</span>
                <span className="font-semibold">{t('serverRecovery')}</span>
                <span className="badge badge-blue">{t('onlineTag')}</span>
              </div>
              <input
                type="email"
                value={mandatoryEmail}
                onChange={(e) => setMandatoryEmail(e.target.value)}
                className="vault-input"
                placeholder={t('emailPlaceholder')}
              />
            </div>
            <button onClick={handleCompleteMandatorySetup} className="vault-btn primary w-full">
              <i className="fas fa-check" /> {t('completeSetup')}
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Main App Screen
  const filteredItems = getFilteredItems()

  return (
    <>
      {/* Top Bar */}
      <header className="fixed top-0 left-0 right-0 z-30" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
        <div className="flex items-center justify-between px-4 py-3 bg-[var(--bg-body)] border-b border-[var(--border-main)]">
          <div className="flex items-center gap-2">
            {renderLogo('xs')}
            <span className="font-bold text-sm">{t('appName')}</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setShowHelpModal(true)} className="icon-btn" title={t('helpTitle')}>
              <i className="fas fa-question-circle" />
            </button>
            <button onClick={theme.toggleTheme} className="icon-btn" title="主题">
              <i className="fas fa-adjust" />
            </button>
            <button onClick={toggleLang} className="icon-btn text-xs font-bold">
              {currentLang === 'en' ? 'EN' : 'CN'}
            </button>
            <button onClick={() => setShowSettingsModal(true)} className="icon-btn" title={t('secTitle')}>
              <i className="fas fa-cog" />
            </button>
            <button onClick={handleLock} className="icon-btn text-red-500" title="锁定">
              <i className="fas fa-lock" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="pt-[calc(60px+env(safe-area-inset-top))]">
        <div className="sticky top-[calc(52px+env(safe-area-inset-top))] z-20 bg-[var(--bg-body)] px-4 py-3 border-b border-[var(--border-main)]">
          <div className="flex gap-2 mb-3">
            <div className="flex-1 relative">
              <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="vault-input pl-10"
                placeholder={t('searchPlaceholder')}
              />
            </div>
            <button
              onClick={() => setShowHiddenItems(!showHiddenItems)}
              className="icon-btn"
              title={showHiddenItems ? '隐藏隐藏项' : '显示隐藏项'}
            >
              <i className={`fas ${showHiddenItems ? 'fa-eye' : 'fa-eye-slash'}`} />
            </button>
          </div>
          <div className="flex gap-2">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value as any)}
              className="vault-input text-sm py-2 flex-1"
            >
              <option value="all">{t('catAll')}</option>
              <option value="social">{t('catSocial')}</option>
              <option value="email">{t('catEmail')}</option>
              <option value="finance">{t('catFinance')}</option>
              <option value="shopping">{t('catShopping')}</option>
              <option value="work">{t('catWork')}</option>
              <option value="server">{t('catServer')}</option>
              <option value="other">{t('catOther')}</option>
            </select>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as SortOrder)}
              className="vault-input text-sm py-2 w-24"
            >
              <option value="newest">{t('sortNewest')}</option>
              <option value="oldest">{t('sortOldest')}</option>
              <option value="name">{t('sortName')}</option>
            </select>
          </div>
        </div>

        {/* Item List */}
        <div className="p-4 space-y-3 scroll-area" style={{ maxHeight: 'calc(100dvh - 180px - env(safe-area-inset-top) - env(safe-area-inset-bottom))' }}>
          {filteredItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-[var(--text-muted)]">
              <i className="fas fa-box-open text-4xl mb-3" />
              <p>{t('emptyDb')}</p>
            </div>
          ) : (
            filteredItems.map(item => (
              <div
                key={item.id}
                className={`vault-item ${item.hidden ? 'hidden-item' : ''}`}
                onClick={() => openViewModal(item)}
              >
                <div className="flex justify-between items-center">
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold truncate">{item.title}</div>
                    <div className="text-sm text-[var(--text-secondary)] flex items-center gap-2 mt-1">
                      <i className="fas fa-user text-xs opacity-50" />
                      <span className="truncate">{item.user || '-'}</span>
                      <i className={`fas ${categoryIcons[item.category]} text-xs opacity-50 ml-2`} />
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleCopy(item.pass)
                    }}
                    className="icon-btn ml-3"
                  >
                    <i className="fas fa-copy" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* FAB */}
      <button onClick={() => openItemModal()} className="fab">
        <i className="fas fa-plus" />
      </button>

      {/* Help Modal - continued in next part... */}
    </>
  )
}
