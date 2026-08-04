'use client'

import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { useState } from 'react'

const menuItems = [
  { label: 'Home', href: '/host/dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { label: 'Quizzes', href: '/host/dashboard/quizzes', icon: 'M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25' },
  { label: 'History', href: '/host/dashboard/history', icon: 'M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z' },
  { label: 'How to Play', href: '/host/dashboard/how-to', icon: 'M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z' },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/host/login')
  }

  return (
    <div className="min-h-screen bg-paper-cream">
      {/* Top bar — paper strip */}
      <header className="h-16 px-4 md:px-6 flex items-center justify-between border-b-2 border-cork-200 bg-paper-white sticky top-0 z-50 shadow-card">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-card hover:bg-cork-100 btn-ghost"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
          <Link href="/host/dashboard" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-card bg-paper-white flex items-center justify-center shadow-pin">
              <img src="/program_icon.svg" alt="SBG Quiz" className="w-6 h-6" />
            </div>
            <span className="font-display font-bold text-lg text-charcoal">
              SBG <span className="text-paper-blue">Quiz</span>
            </span>
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/host/dashboard"
            className="text-sm text-pencil hover:text-charcoal btn-ghost px-3 py-1.5 rounded-card font-semibold"
          >
            Dashboard
          </Link>
          <button
            onClick={handleLogout}
            className="text-sm text-pencil hover:text-paper-red btn-ghost px-3 py-1.5 rounded-card font-semibold"
          >
            Log out
          </button>
        </div>
      </header>

      <div className="flex min-h-[calc(100vh-4rem)]">
        {/* Sidebar — paper panel */}
        <nav className="hidden md:flex flex-col w-56 border-r-2 border-cork-200 bg-paper-white py-4 px-3 gap-1 shrink-0">
          {menuItems.map((item, i) => {
            const isActive = item.href === '/host/dashboard'
              ? pathname === '/host/dashboard'
              : pathname.startsWith(item.href)
            const accentColors = ['paper-blue', 'paper-purple', 'paper-teal', 'paper-orange']
            const accent = accentColors[i % accentColors.length]
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-card text-sm font-semibold btn-ghost
                  ${isActive
                    ? `bg-${accent}/10 text-${accent} border-l-4 border-${accent}`
                    : 'text-pencil hover:text-charcoal hover:bg-cork-50'
                  }`}
              >
                <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                </svg>
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Sidebar — Mobile overlay */}
        {mobileOpen && (
          <>
            <div
              className="fixed inset-0 bg-charcoal/20 z-40 md:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <nav className="fixed left-0 top-16 bottom-0 w-64 bg-paper-white border-r-2 border-cork-200 py-4 px-3 z-50 md:hidden shadow-xl">
              {menuItems.map((item, i) => {
                const isActive = item.href === '/host/dashboard'
                  ? pathname === '/host/dashboard'
                  : pathname.startsWith(item.href)
                const accentColors = ['paper-blue', 'paper-purple', 'paper-teal', 'paper-orange']
                const accent = accentColors[i % accentColors.length]
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-card text-sm font-semibold btn-ghost
                      ${isActive
                        ? `bg-${accent}/10 text-${accent} border-l-4 border-${accent}`
                        : 'text-pencil hover:text-charcoal hover:bg-cork-50'
                      }`}
                  >
                    <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                    </svg>
                    {item.label}
                  </Link>
                )
              })}
            </nav>
          </>
        )}

        {/* Main content */}
        <main className="flex-1 p-4 md:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
