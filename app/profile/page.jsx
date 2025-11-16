'use client'
import { useState, useEffect } from 'react'
import { auth, db } from '@/lib/firebase'
import { onAuthStateChanged, updateProfile } from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import Sidebar from '@/components/Sidebar'

export default function ProfilePage() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [displayName, setDisplayName] = useState('')
  const [saving, setSaving] = useState(false)
  const [userStats, setUserStats] = useState({
    totalReports: 0,
    lastReport: null
  })

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser)
      if (currentUser) {
        setDisplayName(currentUser.displayName || '')
        
        // Fetch user stats from Firestore
        try {
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid))
          if (userDoc.exists()) {
            const data = userDoc.data()
            setUserStats({
              totalReports: data.totalReports || 0,
              lastReport: data.lastReport || null
            })
          }
        } catch (error) {
          console.error('Error fetching user stats:', error)
        }
      }
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])

  const handleSaveProfile = async () => {
    if (!user) return
    
    setSaving(true)
    try {
      // Update Firebase Auth profile
      await updateProfile(user, {
        displayName: displayName
      })

      // Update Firestore user document
      await setDoc(doc(db, 'users', user.uid), {
        displayName: displayName,
        email: user.email,
        updatedAt: new Date()
      }, { merge: true })

      alert('✅ Profile updated successfully!')
    } catch (error) {
      console.error('Error updating profile:', error)
      alert('❌ Error updating profile')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-600">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Please log in</h2>
          <a href="/map" className="text-blue-600 hover:underline">
            Go to login
          </a>
        </div>
      </div>
    )
  }

  return (
    <>
      <Sidebar user={user} />
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-800 mb-8">Profile Settings</h1>

          {/* Profile Card */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Personal Information</h2>
            
            <div className="space-y-4">
              {/* Display Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Display Name
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-800"
                  placeholder="Enter your name"
                />
                <p className="text-xs text-gray-500 mt-1">
                  This name will be shown in the sidebar and to admins if you don't submit anonymously
                </p>
              </div>

              {/* Email (read-only) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={user.email}
                  disabled
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-100 text-gray-600"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Email cannot be changed (UMD authentication)
                </p>
              </div>

              {/* Save Button */}
              <button
                onClick={handleSaveProfile}
                disabled={saving}
                className={`w-full py-3 rounded-lg font-semibold transition ${
                  saving
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>

          {/* Stats Card */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Your Activity</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-3xl font-bold text-blue-600">{userStats.totalReports}</div>
                <div className="text-sm text-gray-600">Total Reports</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-sm font-medium text-gray-600">Last Report</div>
                <div className="text-sm text-gray-800">
                  {userStats.lastReport 
                    ? new Date(userStats.lastReport).toLocaleDateString()
                    : 'No reports yet'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}