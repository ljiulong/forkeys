'use client'

import { useState } from 'react'
import { VaultItem, Category } from '@/types'
import { generatePassword } from '@/lib/utils'

interface ModalsProps {
  t: (key: string) => string
  // View Modal
  showViewModal: boolean
  setShowViewModal: (show: boolean) => void
  currentItem: VaultItem | null
  viewPassVisible: boolean
  setViewPassVisible: (visible: boolean) => void
  onCopy: (text: string) => void
  onEdit: (item: VaultItem) => void
  onDelete: (id: string) => void

  // Item Modal
  showItemModal: boolean
  setShowItemModal: (show: boolean) => void
  itemForm: VaultItem
  setItemForm: (item: VaultItem) => void
  showItemPass: boolean
  setShowItemPass: (show: boolean) => void
  onSaveItem: () => void
  isEditMode: boolean

  // Help Modal
  showHelpModal: boolean
  setShowHelpModal: (show: boolean) => void
  accordionStates: Record<string, boolean>
  setAccordionStates: (states: Record<string, boolean>) => void
}

export function Modals(props: ModalsProps) {
  const { t, showViewModal, setShowViewModal, currentItem, viewPassVisible, setViewPassVisible, onCopy, onEdit, onDelete } = props
  const { showItemModal, setShowItemModal, itemForm, setItemForm, showItemPass, setShowItemPass, onSaveItem, isEditMode } = props
  const { showHelpModal, setShowHelpModal, accordionStates, setAccordionStates } = props

  const toggleAccordion = (key: string) => {
    setAccordionStates({ ...accordionStates, [key]: !accordionStates[key] })
  }

  return (
    <>
      {/* View Modal */}
      {showViewModal && currentItem && (
        <div className="modal-overlay" onClick={() => setShowViewModal(false)}>
          <div className="vault-panel p-5 w-full max-w-md max-h-[90vh] scroll-area" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">{t('viewEntry')}</h3>
              <button onClick={() => setShowViewModal(false)} className="icon-btn">
                <i className="fas fa-times" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-[var(--text-secondary)] mb-1 block">{t('targetLabel')}</label>
                <div className="flex gap-2">
                  <div className="vault-input flex-1 bg-[var(--bg-item)]">{currentItem.title}</div>
                  <button onClick={() => onCopy(currentItem.title)} className="icon-btn">
                    <i className="fas fa-copy" />
                  </button>
                </div>
              </div>
              <div>
                <label className="text-xs text-[var(--text-secondary)] mb-1 block">{t('userIdLabel')}</label>
                <div className="flex gap-2">
                  <div className="vault-input flex-1 bg-[var(--bg-item)]">{currentItem.user || '-'}</div>
                  <button onClick={() => onCopy(currentItem.user)} className="icon-btn">
                    <i className="fas fa-copy" />
                  </button>
                </div>
              </div>
              <div>
                <label className="text-xs text-[var(--text-secondary)] mb-1 block">{t('secretLabel')}</label>
                <div className="flex gap-2">
                  <div className="vault-input flex-1 bg-[var(--bg-item)] flex items-center">
                    <span className="flex-1 font-mono">
                      {viewPassVisible ? currentItem.pass || '-' : '••••••••'}
                    </span>
                  </div>
                  <button onClick={() => setViewPassVisible(!viewPassVisible)} className="icon-btn">
                    <i className={`fas ${viewPassVisible ? 'fa-eye-slash' : 'fa-eye'}`} />
                  </button>
                  <button onClick={() => onCopy(currentItem.pass)} className="icon-btn">
                    <i className="fas fa-copy" />
                  </button>
                </div>
              </div>
              <div>
                <label className="text-xs text-[var(--text-secondary)] mb-1 block">{t('metaLabel')}</label>
                <div className="vault-input bg-[var(--bg-item)] min-h-[60px] whitespace-pre-wrap">
                  {currentItem.note || '-'}
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6 pt-4 border-t border-[var(--border-main)]">
              <button onClick={() => onDelete(currentItem.id)} className="icon-btn text-red-500 border-red-200">
                <i className="fas fa-trash" />
              </button>
              <button onClick={() => onEdit(currentItem)} className="vault-btn primary flex-1">
                <i className="fas fa-edit" /> {t('editEntry')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Item Modal */}
      {showItemModal && (
        <div className="modal-overlay" onClick={() => setShowItemModal(false)}>
          <div className="vault-panel p-5 w-full max-w-md max-h-[90vh] scroll-area" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">{isEditMode ? t('editEntry') : t('newEntry')}</h3>
              <button onClick={() => setShowItemModal(false)} className="icon-btn">
                <i className="fas fa-times" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-[var(--text-secondary)] mb-1 block">{t('targetLabel')}</label>
                <input
                  type="text"
                  value={itemForm.title}
                  onChange={(e) => setItemForm({ ...itemForm, title: e.target.value })}
                  className="vault-input"
                  placeholder="例如: Google"
                />
              </div>
              <div>
                <label className="text-xs text-[var(--text-secondary)] mb-1 block">{t('categoryLabel')}</label>
                <select
                  value={itemForm.category}
                  onChange={(e) => setItemForm({ ...itemForm, category: e.target.value as Category })}
                  className="vault-input"
                >
                  <option value="other">{t('catOther')}</option>
                  <option value="social">{t('catSocial')}</option>
                  <option value="email">{t('catEmail')}</option>
                  <option value="finance">{t('catFinance')}</option>
                  <option value="shopping">{t('catShopping')}</option>
                  <option value="work">{t('catWork')}</option>
                  <option value="server">{t('catServer')}</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-[var(--text-secondary)] mb-1 block">{t('userIdLabel')}</label>
                <input
                  type="text"
                  value={itemForm.user}
                  onChange={(e) => setItemForm({ ...itemForm, user: e.target.value })}
                  className="vault-input"
                  placeholder="用户名/邮箱"
                />
              </div>
              <div>
                <label className="text-xs text-[var(--text-secondary)] mb-1 block">{t('secretLabel')}</label>
                <div className="flex gap-2">
                  <input
                    type={showItemPass ? 'text' : 'password'}
                    value={itemForm.pass}
                    onChange={(e) => setItemForm({ ...itemForm, pass: e.target.value })}
                    className="vault-input flex-1"
                    placeholder="••••••••"
                  />
                  <button onClick={() => setShowItemPass(!showItemPass)} className="icon-btn">
                    <i className={`fas ${showItemPass ? 'fa-eye-slash' : 'fa-eye'}`} />
                  </button>
                  <button
                    onClick={() => {
                      const newPass = generatePassword()
                      setItemForm({ ...itemForm, pass: newPass })
                      setShowItemPass(true)
                    }}
                    className="icon-btn"
                    title="生成随机密码"
                  >
                    <i className="fas fa-dice" />
                  </button>
                </div>
              </div>
              <div>
                <label className="text-xs text-[var(--text-secondary)] mb-1 block">{t('metaLabel')}</label>
                <textarea
                  value={itemForm.note}
                  onChange={(e) => setItemForm({ ...itemForm, note: e.target.value })}
                  rows={2}
                  className="vault-input resize-none"
                  placeholder="可选备注"
                />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={itemForm.hidden}
                  onChange={(e) => setItemForm({ ...itemForm, hidden: e.target.checked })}
                  className="w-4 h-4 accent-[var(--text-accent)]"
                />
                <span className="text-sm text-[var(--text-secondary)]">{t('markAsHidden')}</span>
              </label>
            </div>
            <div className="flex gap-3 mt-6 pt-4 border-t border-[var(--border-main)]">
              <button onClick={onSaveItem} className="vault-btn primary flex-1">
                <i className="fas fa-save" /> {t('saveData')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Help Modal */}
      {showHelpModal && (
        <div className="modal-overlay" onClick={() => setShowHelpModal(false)}>
          <div className="vault-panel w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center p-5 border-b border-[var(--border-main)] bg-[var(--bg-panel)] flex-shrink-0">
              <h3 className="font-bold text-lg">{t('helpTitle')}</h3>
              <button onClick={() => setShowHelpModal(false)} className="icon-btn">
                <i className="fas fa-times" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto scroll-area p-5">
              <div className="accordion">
                {[
                  { key: 'quickStart', icon: 'fa-rocket', title: t('helpQuickStart'), content: t('helpQuickStartContent') },
                  { key: 'security', icon: 'fa-shield-alt', title: t('helpSecurity'), content: t('helpSecurityContent') },
                  { key: 'recovery', icon: 'fa-life-ring', title: t('helpRecovery'), content: t('helpRecoveryContent') },
                  { key: 'tips', icon: 'fa-lightbulb', title: t('helpTips'), content: t('helpTipsContent') },
                  { key: 'faq', icon: 'fa-question-circle', title: t('helpFAQ'), content: t('helpFAQContent') }
                ].map(({ key, icon, title, content }, index) => (
                  <div key={key} className={`accordion-item ${index === 0 || accordionStates[key] ? 'open' : ''}`}>
                    <div className="accordion-header" onClick={() => toggleAccordion(key)}>
                      <h4>
                        <i className={`fas ${icon} text-[var(--text-accent)]`} />
                        <span>{title}</span>
                      </h4>
                      <i className="fas fa-chevron-down accordion-icon" />
                    </div>
                    <div className="accordion-content">
                      <div className="accordion-body">
                        <div className="tip-box">
                          <p className="whitespace-pre-line">{content}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-center text-xs text-[var(--text-muted)] pt-4 mt-4 border-t border-[var(--border-main)]">
                <p>{t('appName')} v2.0</p>
                <p>{t('aboutCopyright')}</p>
              </div>
              <button onClick={() => setShowHelpModal(false)} className="vault-btn primary w-full mt-4">
                {t('helpClose')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
