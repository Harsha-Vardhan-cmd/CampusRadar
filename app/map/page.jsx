'use client'
import { useState, useEffect } from 'react'
import { auth, db } from '@/lib/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore'
import CampusMap from '@/components/CampusMap'
import ReportForm from '@/components/ReportForm'
import Sidebar from '@/components/Sidebar'
import AuthForm from '@/components/AuthForm'

export default function MapPage() {
  const [pinLocation, setPinLocation] = useState(null)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [reports, setReports] = useState([])

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])

  // Fetch recent reports for heatmap (regular users only)
  useEffect(() => {
    if (!user) return

    const q = query(
      collection(db, 'reports'),
      orderBy('createdAt', 'desc'),
      limit(100) // Last 100 reports for heatmap
    )

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const reportsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setReports(reportsData)
    })

    return () => unsubscribe()
  }, [user])

  const handlePinDrop = (location) => {
    setPinLocation(location)
    console.log('Pin dropped at:', location)
  }

  const handleSubmit = (reportData) => {
    console.log('Report submitted:', reportData)
  }

  if (loading) {
    return (
      <>
        <Sidebar user={user} />
        <div className="flex items-center justify-center h-screen">
          <div className="text-gray-600">Loading...</div>
        </div>
      </>
    )
  }

  if (!user) {
    return (
      <>
        <Sidebar user={user} />
        <div className="min-h-screen bg-gray-50 py-20">
          <div className="container mx-auto px-6">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Login Required
              </h1>
              <p className="text-gray-600">
                Please login with your UMD email to submit reports
              </p>
            </div>
            <AuthForm onSuccess={() => setUser(auth.currentUser)} />
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Sidebar user={user} />
      <div className="flex h-screen">
        {/* Map on the left - 60% width */}
        <div className="w-3/5 h-full">
          <CampusMap 
            onPinDrop={handlePinDrop}
            pinLocation={pinLocation}
            showReports={false}
            reports={reports}
          />
        </div>
        
        {/* Form on the right - 40% width */}
        <div className="w-2/5 h-full">
          <ReportForm 
            pinLocation={pinLocation}
            onPinDrop={handlePinDrop}
            onSubmit={handleSubmit}
            currentUser={user}
          />
        </div>
      </div>
    </>
  )
}