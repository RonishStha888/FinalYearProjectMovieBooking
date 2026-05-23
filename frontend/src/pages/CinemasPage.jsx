import { useState, useEffect } from 'react';
import './CinemasPage.css';

export default function CinemasPage({ onBack }) {
  const [cinemas, setCinemas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState('Kathmandu');

  useEffect(() => {
    fetchCinemas();
  }, [selectedCity]);

  const fetchCinemas = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/cinemas?city=${selectedCity}`);
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
                  src={cinema.image || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800'} 
                  alt={cinema.name}
                  className="cinema-image"
                />
                <div className="cinema-overlay">
                  <div className="cinema-rating">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="#ffd700">
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
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                    {cinema.distance}
                  </div>
                </div>

                <div className="cinema-location-info">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" stroke="currentColor" strokeWidth="2"/>
                    <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                  <div>
                    <p className="location-name">{cinema.location}</p>
                    <p className="location-address">{cinema.address}</p>
                  </div>
                </div>

                {cinema.phone && (
                  <div className="cinema-contact">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                    <span>{cinema.phone}</span>
                  </div>
                )}

                {cinema.amenities && cinema.amenities.length > 0 && (
                  <div className="cinema-amenities">
                    {cinema.amenities.slice(0, 4).map((amenity, index) => (
                      <span key={index} className="amenity-badge">
                        {amenity}
                      </span>
                    ))}
                    {cinema.amenities.length > 4 && (
                      <span className="amenity-badge more">+{cinema.amenities.length - 4}</span>
                    )}
                  </div>
                )}

                <button className="view-details-btn">
                  View Details
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
