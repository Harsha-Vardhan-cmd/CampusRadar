'use client'
import { useState, useEffect } from 'react'
import { db, auth } from '@/lib/firebase'
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore'
import { onAuthStateChanged } from 'firebase/auth'
import CampusMap from '@/components/CampusMap'
import Sidebar from '@/components/Sidebar'
import { isAdmin } from '@/lib/adminUsers'

export default function AdminPage() {
  const [reports, setReports] = useState([])
  const [selectedReport, setSelectedReport] = useState(null)
  const [filterRoute, setFilterRoute] = useState('ALL')
  const [filterStatus, setFilterStatus] = useState('ALL')
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  const [adminAccess, setAdminAccess] = useState(false)
  const [showResolveModal, setShowResolveModal] = useState(false)
  const [resolutionComment, setResolutionComment] = useState('')
  const [isResolving, setIsResolving] = useState(false)

  // Check authentication and admin status
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      if (currentUser) {
        setAdminAccess(isAdmin(currentUser.email))
      }
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])

  // Fetch real reports from Firestore (only if admin)
  useEffect(() => {
    if (!adminAccess) return

    const q = query(
      collection(db, 'reports'),
      orderBy('createdAt', 'desc')
    )

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const reportsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.()?.toLocaleString() || 'Just now'
      }))
      setReports(reportsData)
    }, (error) => {
      console.error('Error fetching reports:', error)
    })

    return () => unsubscribe()
  }, [adminAccess])

  // Filter reports
  const filteredReports = reports.filter(report => {
    if (filterRoute !== 'ALL' && report.routedTo !== filterRoute) return false
    if (filterStatus !== 'ALL' && report.status !== filterStatus) return false
    return true
  })
  
  const mapReports = filteredReports.filter(report => report.status !== 'resolved')

  const counts = {
    total: reports.length,
    emergency: reports.filter(r => r.routedTo === 'EMERGENCY').length,
    umpd: reports.filter(r => r.routedTo === 'UMPD').length,
    facilities: reports.filter(r => r.routedTo === 'FACILITIES').length,
    open: reports.filter(r => r.status === 'open').length,
    investigating: reports.filter(r => r.status === 'investigating').length,
    resolved: reports.filter(r => r.status === 'resolved').length
  }

  const getSeverityColor = (score) => {
    if (score >= 8) return 'bg-red-100 text-red-800'
    if (score >= 5) return 'bg-yellow-100 text-yellow-800'
    return 'bg-green-100 text-green-800'
  }

  const getStatusColor = (status) => {
    if (status === 'open') return 'bg-blue-100 text-blue-800'
    if (status === 'investigating') return 'bg-purple-100 text-purple-808'
    return 'bg-gray-100 text-gray-800'
  }

  const handleOpenResolveModal = () => {
    setShowResolveModal(true)
    setResolutionComment('')
  }

  const handleCloseResolveModal = () => {
    setShowResolveModal(false)
    setResolutionComment('')
  }

  const handleResolveReport = async () => {
    if (!resolutionComment.trim()) {
      alert('Please provide a resolution comment')
      return
    }

    if (resolutionComment.trim().length < 10) {
      alert('Resolution comment must be at least 10 characters')
      return
    }

    setIsResolving(true)

    try {
      const { doc, updateDoc, serverTimestamp } = await import('firebase/firestore')
      await updateDoc(doc(db, 'reports', selectedReport.id), {
        status: 'resolved',
        resolutionComment: resolutionComment.trim(),
        resolvedBy: user.email,
        resolvedAt: serverTimestamp()
      })
      
      setSelectedReport(null)
      setShowResolveModal(false)
      setResolutionComment('')
      alert('✅ Report marked as resolved!')
    } catch (error) {
      console.error('Error resolving report:', error)
      alert('❌ Error updating report status')
    } finally {
      setIsResolving(false)
    }
  }

  // Loading state
  if (loading) {
    return (
      <>
        <Sidebar user={user} />
        <div className="pt-16 flex items-center justify-center h-screen bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </>
    )
  }

  // Not logged in
  if (!user) {
    return (
      <>
        <Sidebar user={user} />
        <div className="pt-16 min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg text-center">
            <div className="text-5xl mb-4">🔒</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Authentication Required</h2>
            <p className="text-gray-600 mb-6">
              Please log in to access the admin dashboard
            </p>
            <a 
              href="/map"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Go to Login
            </a>
          </div>
        </div>
      </>
    )
  }

  // Logged in but not admin
  if (!adminAccess) {
    return (
      <>
        <Sidebar user={user} />
        <div className="pt-16 min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg text-center">
            <div className="text-5xl mb-4">⛔</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h2>
            <p className="text-gray-600 mb-2">
              You don't have permission to access the admin dashboard.
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Logged in as: <span className="font-medium">{user.email}</span>
            </p>
            <p className="text-xs text-gray-400 mb-6">
              Only authorized campus safety personnel can access this area.
            </p>
            <a 
              href="/"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Return Home
            </a>
          </div>
        </div>
      </>
    )
  }

  // Admin user - show dashboard
  return (
    <>
      <Sidebar user={user} />
      <div className="pt-16 flex h-screen bg-gray-50">
        {/* Left Panel - Reports List */}
        <div className="w-2/5 bg-white border-r overflow-y-auto">
          <div className="p-6">
            <h1 className="text-3xl font-bold mb-2 text-gray-800">Admin Dashboard</h1>
            <p className="text-gray-600 mb-6">CampusRadar Report Management</p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="bg-red-50 p-3 rounded">
                <div className="text-2xl font-bold text-red-600">{counts.emergency}</div>
                <div className="text-xs text-red-700">Emergency</div>
              </div>
              <div className="bg-yellow-50 p-3 rounded">
                <div className="text-2xl font-bold text-yellow-600">{counts.umpd}</div>
                <div className="text-xs text-yellow-700">UMPD</div>
              </div>
              <div className="bg-green-50 p-3 rounded">
                <div className="text-2xl font-bold text-green-600">{counts.facilities}</div>
                <div className="text-xs text-green-700">Facilities</div>
              </div>
            </div>

            {/* Filters */}
            <div className="space-y-3 mb-6">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Route</label>
                <select 
                  value={filterRoute}
                  onChange={(e) => setFilterRoute(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-gray-800"
                >
                  <option value="ALL">All Routes ({counts.total})</option>
                  <option value="EMERGENCY">Emergency ({counts.emergency})</option>
                  <option value="UMPD">UMPD ({counts.umpd})</option>
                  <option value="FACILITIES">Facilities ({counts.facilities})</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Status</label>
                <select 
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-gray-800"
                >
                  <option value="ALL">All Status ({counts.total})</option>
                  <option value="open">Open ({counts.open})</option>
                  <option value="investigating">Investigating ({counts.investigating})</option>
                  <option value="resolved">Resolved ({counts.resolved})</option>
                </select>
              </div>
            </div>

            {/* Reports List */}
            {filteredReports.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <p className="text-lg mb-2">No reports yet</p>
                <p className="text-sm">Reports will appear here as they are submitted</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredReports.map(report => (
                  <div 
                    key={report.id}
                    onClick={() => setSelectedReport(report)}
                    className={`p-4 border rounded cursor-pointer transition ${
                      selectedReport?.id === report.id 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-semibold text-gray-800">
                        {report.category?.replace('_', ' ').toUpperCase()}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded ${getSeverityColor(report.severityScore)}`}>
                        {report.severityScore}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                      {report.description}
                    </p>
                    <div className="flex justify-between items-center text-xs">
                      <span className={`px-2 py-1 rounded ${getStatusColor(report.status)}`}>
                        {report.status}
                      </span>
                      <span className="text-gray-500">{report.createdAt}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Map */}
        <div className="w-3/5 relative">
          <CampusMap showReports={true} reports={mapReports} />
          
          {/* Selected Report Details Overlay */}
          {selectedReport && (
            <div className="absolute top-4 right-4 bg-white p-4 rounded-lg shadow-lg max-w-md z-10 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-bold text-lg text-gray-800">
                  {selectedReport.category?.replace('_', ' ').toUpperCase()}
                </h3>
                <button 
                  onClick={() => setSelectedReport(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              <div className="space-y-2 text-sm">
                <p className="text-gray-700">{selectedReport.description}</p>
                <div className="flex gap-2">
                  <span className={`px-2 py-1 rounded text-xs ${getSeverityColor(selectedReport.severityScore)}`}>
                    Severity: {selectedReport.severityScore}
                  </span>
                  <span className="px-2 py-1 rounded text-xs bg-blue-100 text-blue-800">
                    {selectedReport.routedTo}
                  </span>
                </div>
                <p className="text-gray-600">
                  <span className="font-medium">Reported by:</span> {selectedReport.userEmail}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Time:</span> {selectedReport.createdAt}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Location:</span> {selectedReport.lat?.toFixed(4)}, {selectedReport.lng?.toFixed(4)}
                </p>
                {selectedReport.photoURL && (
                  <img 
                    src={selectedReport.photoURL} 
                    alt="Report" 
                    className="w-full rounded mt-2"
                  />
                )}
                
                {selectedReport.status === 'resolved' ? (
                  <div className="mt-3">
                    <div className="w-full bg-gray-100 text-gray-600 py-2 rounded text-center font-medium mb-2">
                      ✓ Already Resolved
                    </div>
                    {selectedReport.resolutionComment && (
                      <div className="bg-green-50 border border-green-200 rounded p-3">
                        <p className="text-xs font-medium text-green-800 mb-1">Resolution Comment:</p>
                        <p className="text-sm text-gray-700">{selectedReport.resolutionComment}</p>
                        {selectedReport.resolvedBy && (
                          <p className="text-xs text-gray-500 mt-2">
                            Resolved by: {selectedReport.resolvedBy}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <button 
                    onClick={handleOpenResolveModal}
                    className="w-full bg-green-600 text-white py-2 rounded mt-3 hover:bg-green-700 font-medium"
                  >
                    Mark as Resolved
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Resolution Modal */}
      {showResolveModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6">
            <h3 className="text-2xl font-bold mb-4 text-gray-800">Resolve Report</h3>
            
            <p className="text-sm text-gray-600 mb-4">
              Please provide a brief comment explaining how this report was resolved or what action was taken.
            </p>

            <textarea
              value={resolutionComment}
              onChange={(e) => setResolutionComment(e.target.value)}
              placeholder="e.g., Investigated the area, increased patrol presence, suspect identified, lighting issue fixed..."
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-800 h-32 resize-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              disabled={isResolving}
            />
            
            <p className="text-xs text-gray-500 mt-1 mb-4">
              {resolutionComment.length} characters (minimum 10)
            </p>

            <div className="flex gap-3">
              <button
                onClick={handleCloseResolveModal}
                disabled={isResolving}
                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-300 transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleResolveReport}
                disabled={isResolving || resolutionComment.trim().length < 10}
                className="flex-1 bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isResolving ? 'Resolving...' : 'Confirm Resolution'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}