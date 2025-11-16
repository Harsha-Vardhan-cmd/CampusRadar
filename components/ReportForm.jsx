'use client'
import { useState } from 'react'
import { storage } from '@/lib/firebase'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'

// Expanded UMD Buildings list
const UMD_BUILDINGS = [
  // Academic Buildings
  { name: 'A.V. Williams Building', lat: 38.9887, lng: -76.9365 },
  { name: 'Brendan Iribe Center (Iribe Center)', lat: 38.9890, lng: -76.9368 },
  { name: 'Bioscience Research Building (BRB)', lat: 38.9911, lng: -76.9337 },
  { name: 'Biology-Psychology Building (BPS)', lat: 38.9867, lng: -76.9389 },
  { name: 'Chemistry Building', lat: 38.9864, lng: -76.9417 },
  { name: 'Clarice Smith Performing Arts Center', lat: 38.9871, lng: -76.9373 },
  { name: 'Computer & Space Sciences Building', lat: 38.9903, lng: -76.9353 },
  { name: 'Edward St. John Learning & Teaching Center', lat: 38.9887, lng: -76.9441 },
  { name: 'Francis Scott Key Hall (Key Hall)', lat: 38.9854, lng: -76.9385 },
  { name: 'Hornbake Library', lat: 38.9889, lng: -76.9421 },
  { name: 'H.J. Patterson Hall', lat: 38.9918, lng: -76.9328 },
  { name: 'Jimenez Hall', lat: 38.9876, lng: -76.9398 },
  { name: 'Kim Engineering Building', lat: 38.9893, lng: -76.9379 },
  { name: 'Marie Mount Hall', lat: 38.9869, lng: -76.9406 },
  { name: 'Martin Hall (Tydings Hall)', lat: 38.9863, lng: -76.9438 },
  { name: 'Mathematics Building', lat: 38.9863, lng: -76.9398 },
  { name: 'McKeldin Library', lat: 38.9869, lng: -76.9426 },
  { name: 'Physics Building', lat: 38.9887, lng: -76.9410 },
  { name: 'Plant Sciences Building', lat: 38.9917, lng: -76.9325 },
  { name: 'Prince Frederick Hall', lat: 38.9879, lng: -76.9408 },
  { name: 'Samuel Riggs IV Alumni Center', lat: 38.9847, lng: -76.9488 },
  { name: 'Skinner Building', lat: 38.9858, lng: -76.9452 },
  { name: 'Stamp Student Union (Adele H. Stamp)', lat: 38.9881, lng: -76.9444 },
  { name: 'Symons Hall', lat: 38.9873, lng: -76.9402 },
  { name: 'Taliaferro Hall', lat: 38.9872, lng: -76.9394 },
  { name: 'Turner Hall', lat: 38.9849, lng: -76.9410 },
  { name: 'Van Munching Hall (Robert H. Smith)', lat: 38.9853, lng: -76.9425 },
  
  // James Clark School of Engineering Buildings
  { name: 'James Clark Hall (A. James Clark Hall)', lat: 38.9893, lng: -76.9387 },
  { name: 'Glenn L. Martin Hall (Martin Hall - Engineering)', lat: 38.9898, lng: -76.9387 },
  { name: 'Jeong H. Kim Engineering Building', lat: 38.9893, lng: -76.9379 },
  
  // Dining Halls
  { name: 'Yahentamitsi Dining Hall (Diner)', lat: 38.9872, lng: -76.9391 },
  { name: 'North Campus Dining Hall', lat: 38.9913, lng: -76.9435 },
  { name: 'South Campus Dining Hall', lat: 38.9835, lng: -76.9451 },
  { name: 'Chesapeake Building (Dining)', lat: 38.9906, lng: -76.9442 },
  { name: '251 North (Dining)', lat: 38.9870, lng: -76.9391 },
  
  // Residence Halls
  { name: 'Cambridge Community', lat: 38.9902, lng: -76.9440 },
  { name: 'Oakland Hall', lat: 38.9915, lng: -76.9455 },
  { name: 'Ellicott Community', lat: 38.9918, lng: -76.9428 },
  { name: 'Denton Community', lat: 38.9913, lng: -76.9417 },
  { name: 'South Campus Commons', lat: 38.9832, lng: -76.9448 },
  { name: 'Prince Frederick Hall', lat: 38.9879, lng: -76.9408 },
  { name: 'Centreville Hall', lat: 38.9880, lng: -76.9415 },
  { name: 'Hagerstown Hall', lat: 38.9884, lng: -76.9413 },
  { name: 'Annapolis Hall', lat: 38.9877, lng: -76.9412 },
  { name: 'Easton Hall', lat: 38.9885, lng: -76.9407 },
  { name: 'La Plata Hall', lat: 38.9877, lng: -76.9405 },
  { name: 'Bel Air Hall', lat: 38.9882, lng: -76.9409 },
  { name: 'Caroline Hall', lat: 38.9910, lng: -76.9420 },
  { name: 'Chestertown Hall', lat: 38.9908, lng: -76.9424 },
  { name: 'Wicomico Hall', lat: 38.9906, lng: -76.9428 },
  
  // Athletics & Recreation
  { name: 'SECU Stadium (Byrd Stadium)', lat: 38.9907, lng: -76.9475 },
  { name: 'Xfinity Center (Comcast Center)', lat: 38.9951, lng: -76.9378 },
  { name: 'Eppley Recreation Center', lat: 38.9926, lng: -76.9395 },
  { name: 'Cole Field House', lat: 38.9914, lng: -76.9399 },
  { name: 'Varsity Team House', lat: 38.9905, lng: -76.9487 },
  { name: 'Ludwig Field (Soccer)', lat: 38.9923, lng: -76.9472 },
  { name: 'Shipley Field (Field Hockey)', lat: 38.9928, lng: -76.9467 },
  
  // Parking & Services
  { name: 'Regents Drive Garage', lat: 38.9876, lng: -76.9451 },
  { name: 'Stadium Drive Parking Garage', lat: 38.9909, lng: -76.9489 },
  { name: 'Paint Branch Drive Garage', lat: 38.9922, lng: -76.9415 },
  { name: 'Mowatt Lane Garage', lat: 38.9855, lng: -76.9464 },
  { name: 'Health Center', lat: 38.9878, lng: -76.9467 },
  { name: 'University Book Center', lat: 38.9882, lng: -76.9445 },
  
].sort((a, b) => a.name.localeCompare(b.name))

export default function ReportForm({ pinLocation, onPinDrop, onSubmit, currentUser }) {
  const [formData, setFormData] = useState({
    category: '',
    description: '',
    isAnonymous: false,
    photos: []
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')
  const [showBuildingList, setShowBuildingList] = useState(false)
  const [gettingLocation, setGettingLocation] = useState(false)

  const categories = [
    { value: 'suspicious_activity', label: '🚨 Suspicious Activity' },
    { value: 'substance_abuse', label: '💊 Substance Abuse' },
    { value: 'disorderly_conduct', label: '⚠️ Disorderly Conduct' },
    { value: 'theft', label: '🚲 Theft' },
    { value: 'vandalism', label: '🔨 Vandalism' },
    { value: 'parking_violation', label: '🚗 Parking Violation' },
    { value: 'broken_camera', label: '📹 Broken Camera' },
    { value: 'poor_lighting', label: '💡 Poor Lighting' },
    { value: 'other', label: '❓ Other' }
  ]

  const filteredBuildings = UMD_BUILDINGS.filter(building =>
    building.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleBuildingSelect = (building) => {
    if (onPinDrop) {
      onPinDrop([building.lat, building.lng])
    }
    setSearchTerm(building.name)
    setShowBuildingList(false)
  }

  const handleUseCurrentLocation = () => {
    setGettingLocation(true)
    
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser')
      setGettingLocation(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        if (onPinDrop) {
          onPinDrop([latitude, longitude])
        }
        setSearchTerm('')
        setGettingLocation(false)
      },
      (error) => {
        console.error('Geolocation error:', error)
        let errorMsg = 'Unable to get your location. '
        if (error.code === 1) {
          errorMsg += 'Please enable location permissions in your browser.'
        } else if (error.code === 2) {
          errorMsg += 'Location unavailable.'
        } else {
          errorMsg += 'Request timeout.'
        }
        alert(errorMsg)
        setGettingLocation(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    )
  }

  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files)
    
    if (formData.photos.length + files.length > 3) {
      alert('Maximum 3 photos allowed')
      return
    }

    for (const file of files) {
      if (file.size > 5 * 1024 * 1024) {
        alert(`${file.name} is too large. Maximum 5MB per photo.`)
        return
      }
      if (!file.type.startsWith('image/')) {
        alert(`${file.name} is not an image file`)
        return
      }
    }

    setFormData({...formData, photos: [...formData.photos, ...files]})
  }

  const removePhoto = (index) => {
    const newPhotos = formData.photos.filter((_, i) => i !== index)
    setFormData({...formData, photos: newPhotos})
  }

  const uploadPhotos = async (files, reportId) => {
    try {
      const uploadPromises = files.map(async (file, index) => {
        const fileName = `${Date.now()}_${index}_${file.name}`
        const storageRef = ref(storage, `reports/${reportId}/${fileName}`)
        
        await uploadBytes(storageRef, file)
        const downloadURL = await getDownloadURL(storageRef)
        return downloadURL
      })

      const photoURLs = await Promise.all(uploadPromises)
      return photoURLs
    } catch (error) {
      console.error('Photo upload error:', error)
      throw error
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!pinLocation) {
      alert('Please drop a pin on the map, select a building, or use your current location!')
      return
    }
    
    if (!formData.category) {
      alert('Please select a category!')
      return
    }
    
    if (formData.description.length < 20) {
      alert('Please provide at least 20 characters in the description!')
      return
    }

    setIsSubmitting(true)
    setUploadProgress(0)

    try {
      let photoURLs = []

      if (formData.photos.length > 0) {
        setUploadProgress(25)
        const tempId = `${currentUser.uid}_${Date.now()}`
        photoURLs = await uploadPhotos(formData.photos, tempId)
        setUploadProgress(50)
      }

      const reportData = {
        userId: currentUser.uid,
        userEmail: currentUser.email,
        lat: pinLocation[0],
        lng: pinLocation[1],
        category: formData.category,
        description: formData.description,
        photoURL: photoURLs.length > 0 ? photoURLs[0] : null,
        photoURLs: photoURLs,
        isAnonymous: formData.isAnonymous
      }

      console.log('Submitting report:', reportData)

      setUploadProgress(75)

      const response = await fetch('/api/submit-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reportData)
      })

      const result = await response.json()

      if (response.ok) {
        setUploadProgress(100)
        alert(`✅ Report submitted successfully!\n\nSeverity: ${result.severityScore}/10\nRouted to: ${result.routedTo}\n\nCampus safety has been notified.`)
        
        setFormData({
          category: '',
          description: '',
          isAnonymous: false,
          photos: []
        })
        setSearchTerm('')
        setUploadProgress(0)
      } else {
        alert(`❌ Error: ${result.error || 'Failed to submit report'}`)
      }
    } catch (error) {
      console.error('Submission error:', error)
      alert(`❌ Error submitting report: ${error.message}`)
    } finally {
      setIsSubmitting(false)
      setUploadProgress(0)
    }
  }

  return (
    <div className="bg-white p-6 h-full overflow-y-auto">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Submit Report</h2>
      
      {/* Location Selection Section */}
      <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded">
        <h3 className="font-semibold text-gray-800 mb-3">📍 Set Location</h3>
        
        {/* Current Location Button */}
        <button
          type="button"
          onClick={handleUseCurrentLocation}
          disabled={gettingLocation}
          className={`w-full mb-3 py-2 rounded font-medium transition ${
            gettingLocation 
              ? 'bg-gray-400 cursor-not-allowed text-white' 
              : 'bg-green-600 hover:bg-green-700 text-white'
          }`}
        >
          {gettingLocation ? '📍 Getting location...' : '📍 Use My Current Location'}
        </button>

        {/* Building Search */}
        <div className="relative">
          <label className="block text-sm font-medium mb-1 text-gray-700">
            Or search for a UMD building:
          </label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
              setShowBuildingList(true)
            }}
            onFocus={() => setShowBuildingList(true)}
            placeholder="Type building name (e.g., James Clark, Yahentamitsi)..."
            className="w-full border border-gray-300 rounded px-3 py-2 text-gray-800"
          />
          
          {/* Building Dropdown */}
          {showBuildingList && searchTerm && filteredBuildings.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {filteredBuildings.map((building, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleBuildingSelect(building)}
                  className="w-full text-left px-4 py-2 hover:bg-blue-50 text-gray-800 text-sm border-b last:border-b-0"
                >
                  {building.name}
                </button>
              ))}
            </div>
          )}

          {showBuildingList && searchTerm && filteredBuildings.length === 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-3 text-sm text-gray-500">
              No buildings found
            </div>
          )}
        </div>

        <p className="text-xs text-gray-600 mt-2">
          Or click directly on the map to drop a pin
        </p>
      </div>

      {/* Location Status */}
      {!pinLocation ? (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded mb-4">
          ⚠️ Please set a location using one of the methods above
        </div>
      ) : (
        <div className="bg-green-100 border border-green-400 text-green-800 px-4 py-3 rounded mb-4">
          ✅ Location set: {pinLocation[0].toFixed(4)}, {pinLocation[1].toFixed(4)}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Category */}
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({...formData, category: e.target.value})}
            className="w-full border border-gray-300 rounded px-3 py-2 text-gray-800 bg-white"
            required
            disabled={isSubmitting}
          >
            <option value="">Select a category...</option>
            {categories.map(cat => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">
            Description <span className="text-red-500">*</span>
            <span className="text-gray-500 text-xs ml-2">
              ({formData.description.length}/500 chars, min 20)
            </span>
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value.slice(0, 500)})}
            className="w-full border border-gray-300 rounded px-3 py-2 h-32 text-gray-800 bg-white"
            placeholder="Describe what you saw or the issue you're reporting..."
            required
            disabled={isSubmitting}
          />
        </div>

        {/* Photo Upload */}
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">
            Photos (Optional - Max 3)
          </label>
          
          {formData.photos.length < 3 && (
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handlePhotoChange}
              className="w-full border border-gray-300 rounded px-3 py-2 text-gray-700 bg-white"
              disabled={isSubmitting}
            />
          )}

          {formData.photos.length > 0 && (
            <div className="mt-3 space-y-2">
              {formData.photos.map((photo, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded border">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-700">📷 {photo.name}</span>
                    <span className="text-xs text-gray-500">
                      ({(photo.size / 1024).toFixed(1)} KB)
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removePhoto(index)}
                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                    disabled={isSubmitting}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}

          {formData.photos.length >= 3 && (
            <p className="text-sm text-gray-600 mt-2">
              ✓ Maximum photos added (3/3)
            </p>
          )}

          {uploadProgress > 0 && uploadProgress < 100 && (
            <div className="mt-2">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-600 mt-1">Uploading photos... {uploadProgress}%</p>
            </div>
          )}
        </div>

{/* Anonymous Toggle */}
<div>
  <div className="flex items-center">
    <input
      type="checkbox"
      checked={formData.isAnonymous}
      onChange={(e) => setFormData({...formData, isAnonymous: e.target.value})}
      className="mr-2 w-4 h-4"
      id="anonymous"
      disabled={isSubmitting}
    />
    <label htmlFor="anonymous" className="text-sm text-gray-700">
      Submit anonymously
    </label>
  </div>
  <p className="text-xs text-gray-600 mt-2 ml-6">
    ℹ️ Leaving this box unchecked makes your name and email visible to campus safety personnel reviewing the report.
  </p>
</div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-3 rounded font-semibold transition ${
            isSubmitting 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {uploadProgress > 0 && uploadProgress < 100 ? `Uploading... ${uploadProgress}%` : 'Submitting Report...'}
            </span>
          ) : (
            'Submit Report'
          )}
        </button>
      </form>
    </div>
  )
}