'use client'
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet'
import { useState, useEffect } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Heatmap component
function HeatmapLayer({ points }) {
  const map = useMap()

  useEffect(() => {
    if (!points || points.length === 0) return

    // Dynamically import leaflet.heat
    import('leaflet.heat').then((heat) => {
      // Remove existing heatmap layer if it exists
      map.eachLayer((layer) => {
        if (layer instanceof L.HeatLayer) {
          map.removeLayer(layer)
        }
      })

      // Create heatmap layer
      // Format: [lat, lng, intensity]
      const heatPoints = points.map(p => [p.lat, p.lng, p.intensity || 0.5])
      
      const heatLayer = L.heatLayer(heatPoints, {
        radius: 25,
        blur: 35,
        maxZoom: 17,
        max: 1.0,
        gradient: {
          0.0: 'blue',
          0.3: 'lime',
          0.5: 'yellow',
          0.7: 'orange',
          1.0: 'red'
        }
      })

      heatLayer.addTo(map)
    })

    return () => {
      // Cleanup on unmount
      map.eachLayer((layer) => {
        if (layer instanceof L.HeatLayer) {
          map.removeLayer(layer)
        }
      })
    }
  }, [points, map])

  return null
}

export default function CampusMap({ onPinDrop, pinLocation, showReports = false, reports = [] }) {
  const [position, setPosition] = useState(null)
  
  // Sync position with pinLocation prop when it changes
  useEffect(() => {
    if (pinLocation) {
      setPosition(pinLocation)
    }
  }, [pinLocation])
  
  // Fix Leaflet marker icons
  useEffect(() => {
    delete L.Icon.Default.prototype._getIconUrl
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    })
  }, [])
  
  // UMD Campus center coordinates
  const UMD_CENTER = [38.9869, -76.9426]
  
  // Component to handle map clicks
  function LocationMarker() {
    useMapEvents({
      click(e) {
        const newPos = [e.latlng.lat, e.latlng.lng]
        setPosition(newPos)
        if (onPinDrop) {
          onPinDrop(newPos)
        }
      },
    })
    
    return position === null ? null : (
      <Marker position={position}>
        <Popup>Your Report Location</Popup>
      </Marker>
    )
  }

  // Prepare heatmap data for regular users
  const heatmapPoints = reports.map(report => ({
    lat: report.lat,
    lng: report.lng,
    intensity: report.severityScore / 10 // Normalize to 0-1
  }))

  return (
    <MapContainer 
      center={UMD_CENTER} 
      zoom={16} 
      style={{ height: '100%', width: '100%' }}
      className="z-0"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      
      {/* Show markers for admin, heatmap for regular users */}
      {showReports ? (
        // Admin view - show individual markers
        reports.map(report => (
          <Marker 
            key={report.id} 
            position={[report.lat, report.lng]}
          >
            <Popup>
              <div className="text-sm">
                <div className="font-bold text-base mb-1">
                  {report.category.replace('_', ' ').toUpperCase()}
                </div>
                <div className="mb-2">{report.description}</div>
                <div className="text-xs text-gray-600">
                  Severity: {report.severityScore} | Routed to: {report.routedTo}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {report.createdAt}
                </div>
              </div>
            </Popup>
          </Marker>
        ))
      ) : (
        // Regular user view - show heatmap
        <HeatmapLayer points={heatmapPoints} />
      )}
      
      {/* New pin from user */}
      <LocationMarker />
    </MapContainer>
  )
}