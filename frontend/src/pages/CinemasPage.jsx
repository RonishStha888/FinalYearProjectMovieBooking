import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import './CinemasPage.css';

// Import cinema images
import qfxLabim from '../assets/qfx-labim.jpg';
import qfxCivil from '../assets/qfx-civil.jpg';
import qfxJainepal from '../assets/qfx-jainepal.png';
import fcube from '../assets/fcube.png';
import bigmovies from '../assets/bigmovies.jpg';
import gopikrishna from '../assets/gopikrishna.jpg';
import { API_URL } from '../config';

// Map image paths to imported images
const imageMap = {
  '/src/assets/qfx-labim.jpg': qfxLabim,
  '/src/assets/qfx-civil.jpg': qfxCivil,
  '/src/assets/qfx-jainepal.png': qfxJainepal,
  '/src/assets/fcube.png': fcube,
  '/src/assets/bigmovies.jpg': bigmovies,
  '/src/assets/gopikrishna.jpg': gopikrishna
};

// Fix Leaflet default marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Routing Machine Component - Shows shortest route only
function RoutingMachine({ start, end }) {
  const map = useMap();

  useEffect(() => {
    if (!map || !start || !end) return;

    const routingControl = L.Routing.control({
      waypoints: [
        L.latLng(start[0], start[1]),
        L.latLng(end[0], end[1])
      ],
      routeWhileDragging: true,
      showAlternatives: false, // Only show the shortest route
      addWaypoints: false, // Prevent adding waypoints by clicking
      fitSelectedRoutes: true, // Auto-fit map to show the route
      lineOptions: {
        styles: [{ color: '#1a73e8', weight: 5, opacity: 0.8 }],
        extendToWaypoints: true,
        missingRouteTolerance: 0
      },
      altLineOptions: {
        styles: [{ color: '#999', weight: 4, opacity: 0.4 }]
      },
      router: L.Routing.osrmv1({
        serviceUrl: 'https://router.project-osrm.org/route/v1',
        profile: 'driving', // Use driving profile for shortest route
      }),
      createMarker: function(i, waypoint) {
        const marker = L.marker(waypoint.latLng, {
          draggable: true,
          icon: L.icon({
            iconUrl: i === 0 
              ? 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png'
              : 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
          })
        });
        return marker;
      }
    }).addTo(map);

    return () => {
      if (routingControl) {
        map.removeControl(routingControl);
      }
    };
  }, [map, start, end]);

  return null;
}

export default function CinemasPage({ onBack }) {
  const [cinemas, setCinemas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState('Kathmandu');
  const [selectedCinema, setSelectedCinema] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [showDirections, setShowDirections] = useState(false);
  const [startLocation, setStartLocation] = useState('');
  const [startCoords, setStartCoords] = useState(null);
  const [endCoords, setEndCoords] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

  // Cinema coordinates (approximate locations in Kathmandu)
  const cinemaCoordinates = {
    'QFX Labim Mall': [27.6767, 85.3206],
    'QFX Civil Mall': [27.7045, 85.3150],
    'QFX Jai Nepal': [27.7089, 85.3140],
    'Fcube Cinemas': [27.6710, 85.4298],
    'Big Movies': [27.6710, 85.4298],
    'Gopi Krishna Movies': [27.7089, 85.3140]
  };

  // Get user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          console.log('Location access denied:', error);
        }
      );
    }
  }, []);

  // Helper function to get the correct image
  const getCinemaImage = (imagePath) => {
    return imageMap[imagePath] || imagePath || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800';
  };

  const handleViewDetails = (cinema) => {
    setSelectedCinema(cinema);
    setActiveTab('overview');
    setShowDirections(false);
  };

  const handleCloseDetails = () => {
    setSelectedCinema(null);
    setShowDirections(false);
  };

  const handleDirections = () => {
    setShowDirections(true);
    const coords = cinemaCoordinates[selectedCinema.name];
    if (coords) {
      setEndCoords(coords);
      // Set user location as start if available
      if (userLocation) {
        setStartCoords(userLocation);
        setStartLocation('Your Location');
      }
    }
  };

  const handleStartLocationSearch = async (e) => {
    e.preventDefault();
    if (!startLocation) return;

    // Use Nominatim API to geocode the address
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(startLocation + ', Kathmandu, Nepal')}`
      );
      const data = await response.json();
      
      if (data && data.length > 0) {
        setStartCoords([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
      } else {
        alert('Location not found. Please try a different address.');
      }
    } catch (error) {
      console.error('Error geocoding address:', error);
      alert('Error finding location. Please try again.');
    }
  };

  const handleUseMyLocation = () => {
    if (userLocation) {
      setStartCoords(userLocation);
      setStartLocation('Your Location');
    } else {
      alert('Location access denied. Please enable location services.');
    }
  };

  useEffect(() => {
    fetchCinemas();
  }, [selectedCity]);

  const fetchCinemas = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/cinemas?city=${selectedCity}`);
      const data = await response.json();
      
      if (data.success) {
        setCinemas(data.cinemas);
      } else {
        console.error('Failed to fetch cinemas:', data.message);
        setCinemas([]);
      }
    } catch (error) {
      console.error('Error fetching cinemas:', error);
      setCinemas([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cinemas-page">
      <div className="cinemas-header">
        <button className="back-button" onClick={onBack}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back
        </button>
        <h1>Our Cinemas</h1>
        <div className="city-selector">
          <select 
            value={selectedCity} 
            onChange={(e) => setSelectedCity(e.target.value)}
            className="city-dropdown"
          >
            <option value="Kathmandu">Kathmandu</option>
            <option value="Pokhara">Pokhara</option>
            <option value="Lalitpur">Lalitpur</option>
            <option value="Bhaktapur">Bhaktapur</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading cinemas...</p>
        </div>
      ) : cinemas.length === 0 ? (
        <div className="no-cinemas">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
            <path d="M3 10h18M3 14h18M8 18h8M10 6h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <h3>No Cinemas Found</h3>
          <p>No cinemas available in {selectedCity} at the moment.</p>
        </div>
      ) : (
        <div className="cinemas-grid">
          {cinemas.map((cinema) => (
            <div key={cinema._id} className="cinema-card">
              <div className="cinema-image-container">
                <img 
                  src={getCinemaImage(cinema.image)} 
                  alt={cinema.name}
                  className="cinema-image"
                />
                <div className="cinema-overlay">
                  <div className="cinema-rating">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="#ffd700">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                    <span>{cinema.rating.toFixed(1)}</span>
                  </div>
                </div>
              </div>

              <div className="cinema-content">
                <div className="cinema-header">
                  <h2>{cinema.name}</h2>
                  <div className="cinema-distance">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                      <path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                    {cinema.distance}
                  </div>
                </div>

                <div className="cinema-location">
                  <p className="location-name">{cinema.location}</p>
                  <p className="location-address">{cinema.address}</p>
                </div>

                {cinema.amenities && cinema.amenities.length > 0 && (
                  <div className="cinema-amenities">
                    {cinema.amenities.slice(0, 3).map((amenity, index) => (
                      <span key={index} className="amenity-badge">
                        {amenity}
                      </span>
                    ))}
                    {cinema.amenities.length > 3 && (
                      <span className="amenity-badge more">+{cinema.amenities.length - 3}</span>
                    )}
                  </div>
                )}

                <button className="view-details-btn" onClick={() => handleViewDetails(cinema)}>
                  View Details
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Cinema Details Panel - Google Maps Style */}
      {selectedCinema && (
        <>
          <div className="details-overlay" onClick={handleCloseDetails}></div>
          <div className="cinema-details-panel">
            {/* Close Button */}
            <button className="close-details-btn" onClick={handleCloseDetails}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            {/* Cinema Image Header */}
            <div className="details-image-header">
              <img 
                src={getCinemaImage(selectedCinema.image)} 
                alt={selectedCinema.name}
                className="details-header-image"
              />
              
            </div>

            {/* Cinema Title & Rating */}
            <div className="details-title-section">
              <h2>{selectedCinema.name}</h2>
              <p className="details-subtitle">{selectedCinema.location}</p>
              <div className="details-rating-row">
                <span className="details-rating">
                  {selectedCinema.rating.toFixed(1)}
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="#ffd700">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                </span>
                <span className="details-category">Movie theater</span>
                <span className="details-accessibility"></span>
              </div>
            </div>

            {/* Tabs */}
            <div className="details-tabs">
              <button 
                className={`details-tab ${activeTab === 'overview' ? 'active' : ''}`}
                onClick={() => setActiveTab('overview')}
              >
                Overview
              </button>
              <button 
                className={`details-tab ${activeTab === 'reviews' ? 'active' : ''}`}
                onClick={() => setActiveTab('reviews')}
              >
                Reviews
              </button>
              <button 
                className={`details-tab ${activeTab === 'about' ? 'active' : ''}`}
                onClick={() => setActiveTab('about')}
              >
                About
              </button>
            </div>

            {/* Action Buttons */}
            <div className="details-actions">
              <button className="action-btn primary" onClick={handleDirections}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M9 11a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" stroke="currentColor" strokeWidth="2"/>
                  <path d="M17.657 16.657l-4.243 4.243a2 2 0 0 1 -2.827 0l-4.244 -4.243a8 8 0 1 1 11.314 0z" stroke="currentColor" strokeWidth="2"/>
                </svg>
                <span>Directions</span>
              </button>
              <button className="action-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="2"/>
                </svg>
                <span>Save</span>
              </button>
              <button className="action-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                  <path d="M12 8v4l3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                <span>Nearby</span>
              </button>
              <button className="action-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <rect x="5" y="2" width="14" height="20" rx="2" stroke="currentColor" strokeWidth="2"/>
                  <path d="M12 18h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                <span>Send to phone</span>
              </button>
              <button className="action-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <circle cx="18" cy="5" r="3" stroke="currentColor" strokeWidth="2"/>
                  <circle cx="6" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                  <circle cx="18" cy="19" r="3" stroke="currentColor" strokeWidth="2"/>
                  <path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98" stroke="currentColor" strokeWidth="2"/>
                </svg>
                <span>Share</span>
              </button>
            </div>

            {/* Tab Content */}
            <div className="details-content">
              {showDirections ? (
                <div className="directions-content">
                  <div className="directions-header">
                    <button className="back-to-overview" onClick={() => setShowDirections(false)}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Back to Overview
                    </button>
                    <h3>Get Directions</h3>
                  </div>

                  <div className="directions-form">
                    <div className="location-input-group">
                      <div className="location-marker start">A</div>
                      <div className="location-input-wrapper">
                        <input
                          type="text"
                          placeholder="Enter starting location"
                          value={startLocation}
                          onChange={(e) => setStartLocation(e.target.value)}
                          className="location-input"
                        />
                        <button 
                          className="use-location-btn" 
                          onClick={handleUseMyLocation}
                          title="Use my location"
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                            <path d="M12 2v4M12 18v4M2 12h4M18 12h4" stroke="currentColor" strokeWidth="2"/>
                          </svg>
                        </button>
                      </div>
                    </div>

                    <div className="location-input-group">
                      <div className="location-marker end">B</div>
                      <input
                        type="text"
                        value={selectedCinema.name}
                        readOnly
                        className="location-input readonly"
                      />
                    </div>

                    <button 
                      className="search-route-btn" 
                      onClick={handleStartLocationSearch}
                      disabled={!startLocation}
                    >
                      Search Route
                    </button>
                  </div>

                  {startCoords && endCoords && (
                    <div className="map-container">
                      <MapContainer
                        center={startCoords}
                        zoom={13}
                        style={{ height: '500px', width: '100%' }}
                      >
                        <TileLayer
                          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <RoutingMachine start={startCoords} end={endCoords} />
                      </MapContainer>
                    </div>
                  )}

                  {!startCoords && (
                    <div className="map-placeholder">
                      <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
                        <path d="M9 11a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" stroke="currentColor" strokeWidth="2"/>
                        <path d="M17.657 16.657l-4.243 4.243a2 2 0 0 1 -2.827 0l-4.244 -4.243a8 8 0 1 1 11.314 0z" stroke="currentColor" strokeWidth="2"/>
                      </svg>
                      <p>Enter your starting location to see directions</p>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  {activeTab === 'overview' && (
                <div className="overview-content">
                  {/* Address */}
                  <div className="detail-item">
                    <div className="detail-icon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M9 11a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" stroke="currentColor" strokeWidth="2"/>
                        <path d="M17.657 16.657l-4.243 4.243a2 2 0 0 1 -2.827 0l-4.244 -4.243a8 8 0 1 1 11.314 0z" stroke="currentColor" strokeWidth="2"/>
                      </svg>
                    </div>
                    <div className="detail-content-text">
                      <h4>{selectedCinema.address}</h4>
                      <p className="detail-subtext">Located in: {selectedCinema.location}</p>
                      <button className="copy-address-btn">Copy address</button>
                    </div>
                  </div>

                  {/* Website */}
                  {selectedCinema.email && (
                    <div className="detail-item">
                      <div className="detail-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                          <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                      </div>
                      <div className="detail-content-text">
                        <a href={`mailto:${selectedCinema.email}`} className="detail-link">
                          {selectedCinema.email.replace('@', ' @ ')}
                        </a>
                      </div>
                    </div>
                  )}

                  {/* Phone */}
                  {selectedCinema.phone && (
                    <div className="detail-item">
                      <div className="detail-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                          <path d="M5 4h4l2 5l-2.5 1.5a11 11 0 0 0 5 5l1.5 -2.5l5 2v4a2 2 0 0 1 -2 2a16 16 0 0 1 -15 -15a2 2 0 0 1 2 -2" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                      </div>
                      <div className="detail-content-text">
                        <a href={`tel:${selectedCinema.phone}`} className="detail-link">
                          {selectedCinema.phone}
                        </a>
                      </div>
                    </div>
                  )}

                  {/* Amenities */}
                  {selectedCinema.amenities && selectedCinema.amenities.length > 0 && (
                    <div className="detail-item">
                      <div className="detail-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                          <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                      </div>
                      <div className="detail-content-text">
                        <h4>Amenities</h4>
                        <div className="amenities-list">
                          {selectedCinema.amenities.map((amenity, index) => (
                            <span key={index} className="amenity-tag">
                              {amenity}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Distance */}
                  <div className="detail-item">
                    <div className="detail-icon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M3 12h18M3 12l4-4m-4 4l4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <div className="detail-content-text">
                      <h4>Distance from center</h4>
                      <p>{selectedCinema.distance}</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="reviews-content">
                  <div className="reviews-summary">
                    <div className="reviews-rating-large">
                      <span className="rating-number">{selectedCinema.rating.toFixed(1)}</span>
                      <div className="rating-stars">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} width="20" height="20" viewBox="0 0 24 24" fill={i < Math.floor(selectedCinema.rating) ? '#ffd700' : '#ddd'}>
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                          </svg>
                        ))}
                      </div>
                      <p className="reviews-count">Based on customer reviews</p>
                    </div>
                  </div>
                  <p className="no-reviews-text">Reviews coming soon...</p>
                </div>
              )}

              {activeTab === 'about' && (
                <div className="about-content">
                  <div className="about-section">
                    <h3>About {selectedCinema.name}</h3>
                    <p>
                      {selectedCinema.name} is a premier movie theater located in {selectedCinema.location}, {selectedCinema.city}. 
                      We offer the latest movies with state-of-the-art facilities and comfortable seating.
                    </p>
                  </div>
                  
                  <div className="about-section">
                    <h4>Location</h4>
                    <p>{selectedCinema.address}</p>
                    <p className="about-distance">📍 {selectedCinema.distance} from city center</p>
                  </div>

                  {selectedCinema.amenities && selectedCinema.amenities.length > 0 && (
                    <div className="about-section">
                      <h4>Facilities</h4>
                      <ul className="facilities-list">
                        {selectedCinema.amenities.map((amenity, index) => (
                          <li key={index}>✓ {amenity}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
