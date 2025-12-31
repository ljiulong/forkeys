import type { Metadata } from 'next'
import { VaultProvider } from '@/components/VaultProvider'
import '@/styles/globals.css'

export const metadata: Metadata = {
  title: 'Forkeys - 安全密码管理器',
  description: '安全存储您的数字资产 - Securely store your digital assets',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Forkeys'
  },
  formatDetection: {
    telephone: false
  },
  icons: {
    icon: '/icons/icon-192.png',
    apple: '/icons/icon-192.png'
  }
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover' as const,
  themeColor: '#f8fafc'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
        />
      </head>
      <body>
        <VaultProvider>
          {children}
        </VaultProvider>
      </body>
    </html>
  )
}
