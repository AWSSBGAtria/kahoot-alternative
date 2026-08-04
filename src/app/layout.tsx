import type { Metadata } from 'next'
import { Bungee, DM_Sans, JetBrains_Mono } from 'next/font/google'
import './globals.css'

export const viewport = {
  themeColor: '#fef7e8',
}

const bungee = Bungee({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bungee',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-dm-sans',
  display: 'swap',
})

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['500', '700'],
  variable: '--font-jetbrains',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'SBG Quiz',
  description: 'Live quiz platform for classrooms',
  icons: {
    icon: '/program_icon.svg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${bungee.variable} ${dmSans.variable} ${jetbrains.variable}`}>
      <body className="font-body bg-paper-cream text-charcoal min-h-screen antialiased">
        {children}
      </body>
    </html>
  )
}
