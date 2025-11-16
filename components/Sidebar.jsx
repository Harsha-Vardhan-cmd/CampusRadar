'use client'
import { useState } from 'react'
import { auth } from '@/lib/firebase'
import { signOut } from 'firebase/auth'
import { useRouter } from 'next/navigation'
import { isAdmin } from '@/lib/adminUsers'

export default function Sidebar({ user }) {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await signOut(auth)
      router.push('/')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const menuItems = [
    { label: 'Home', href: '/', icon: '🏠' },
    { label: 'Submit Report', href: '/map', icon: '📍', hideForAdmin: true },
    { label: 'Admin Dashboard', href: '/admin', icon: '🛡️', adminOnly: true },
    { label: 'FAQ', href: '/faq', icon: '❓' },
    { label: 'Profile', href: '/profile', icon: '👤' },
  ]

  return (
    <>
      {/* Hamburger Button - Glassmorphism, slightly smaller & higher */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-4 left-4 z-50 bg-gradient-to-r from-cyan-500/80 to-blue-500/80 backdrop-blur-md text-white p-2 md:p-3 rounded-full shadow-lg hover:from-cyan-400/90 hover:to-blue-400/90 transition-all duration-300 border border-white/20"
      >
        <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Glassmorphism Overlay - blurred background */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 transition-all duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar - Glassmorphism */}
      <div
        className={`fixed top-0 left-0 h-full w-80 bg-gradient-to-br from-slate-800/95 via-slate-900/95 to-blue-900/95 backdrop-blur-xl shadow-2xl z-50 transform transition-all duration-300 border-r border-cyan-500/30 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-cyan-600/90 to-blue-600/90 backdrop-blur-lg text-white p-6 border-b border-white/20">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold">CampusRadar</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/90 hover:text-white hover:bg-white/20 rounded-lg p-1 transition-all"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          {user && (
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-3 border border-white/20">
              <p className="text-xs opacity-90 mb-1">Logged in as</p>
              <p className="font-medium truncate text-sm">{user.displayName || user.email}</p>
            </div>
          )}
        </div>

        {/* Menu Items */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item, index) => {
            // Hide if user not logged in and item requires admin
            if (item.adminOnly && !user) return null

            // Hide "Submit Report" if user is admin
            if (item.hideForAdmin && user && isAdmin(user.email)) return null

            return (
              <a
                key={index}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-4 px-4 py-3 rounded-xl bg-white/5 hover:bg-gradient-to-r hover:from-cyan-500/20 hover:to-blue-500/20 border border-white/10 hover:border-cyan-400/50 transition-all duration-300 text-slate-200 hover:text-white group backdrop-blur-sm"
              >
                <span className="text-2xl group-hover:scale-110 transition-transform">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </a>
            )
          })}
        </nav>

        {/* Logout Button */}
        {user && (
          <div className="absolute bottom-6 left-4 right-4">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-red-500/80 to-red-600/80 backdrop-blur-md text-white py-3 rounded-xl hover:from-red-400/90 hover:to-red-500/90 transition-all duration-300 font-medium shadow-lg border border-white/20"
            >
              <span>🚪</span>
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>
    </>
  )
}
