'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { auth } from '@/lib/firebase'
import { signOut } from 'firebase/auth'
import { useState, useEffect } from 'react'

export default function Navbar() {
  const pathname = usePathname()
  const [user, setUser] = useState(null)
  
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser)
    })
    return () => unsubscribe()
  }, [])
  
  const isActive = (path) => {
    return pathname === path ? 'bg-blue-700' : 'hover:bg-blue-700'
  }

  const handleLogout = async () => {
    await signOut(auth)
  }

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold">
            🎯 CampusRadar
          </Link>
          
          {/* Navigation Links */}
          <div className="flex gap-4 items-center">
            <Link 
              href="/"
              className={`px-4 py-2 rounded transition ${isActive('/')}`}
            >
              Home
            </Link>
            <Link 
              href="/map"
              className={`px-4 py-2 rounded transition ${isActive('/map')}`}
            >
              Submit Report
            </Link>
            
            {/* User info if logged in */}
            {user && (
              <div className="flex items-center gap-3 ml-4 pl-4 border-l border-blue-500">
                <div className="text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-700 rounded-full flex items-center justify-center font-bold">
                      {user.email?.[0].toUpperCase()}
                    </div>
                    <span className="hidden md:inline">{user.email}</span>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-3 py-1 bg-blue-700 hover:bg-blue-800 rounded text-sm transition"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}