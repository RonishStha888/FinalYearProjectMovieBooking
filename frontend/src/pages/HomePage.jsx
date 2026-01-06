import { useState, useEffect } from "react";
import "./HomePage.css";
import BookingPage from "./BookingPage";

export default function HomePage({ user, onLogout }) {
  const [selectedCategory, setSelectedCategory] = useState("now-showing");
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [showBooking, setShowBooking] = useState(false);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [featuredMovie, setFeaturedMovie] = useState(null);

  // Fetch movies when category changes
  useEffect(() => {
    fetchMovies();
  }, [selectedCategory]);

  const fetchMovies = async () => {
    setLoading(true);
    try {
      let apiUrl = `http://localhost:5000/api/movies`;
      
      if (selectedCategory === 'now-showing') {
        apiUrl = `http://localhost:5000/api/movies/now-showing`;
      } else if (selectedCategory === 'top-rated') {
        apiUrl = `http://localhost:5000/api/movies/top-rated`;
      } else if (selectedCategory === 'coming-soon') {
        apiUrl = `http://localhost:5000/api/movies/now-showing`;
      } else {
        apiUrl = `http://localhost:5000/api/movies?category=${selectedCategory}&limit=20`;
      }
      
      const response = await fetch(apiUrl);
      const data = await response.json();
      
      if (data.success) {
        setMovies(data.movies);
        // Set featured movie as the first movie with highest rating
        const featured = data.movies.reduce((prev, current) => 
          (parseFloat(prev.rating) > parseFloat(current.rating)) ? prev : current
        );
        setFeaturedMovie(featured);
      } else {
        console.error('Failed to fetch movies:', data.message);
        setMovies([]);
      }
    } catch (error) {
      console.error('Error fetching movies:', error);
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  const handleMovieClick = (movie) => {
    const movieWithId = { ...movie, id: movie._id };
    setSelectedMovie(movieWithId);
    setShowBooking(true);
  };

  const handleBackToHome = () => {
    setShowBooking(false);
    setSelectedMovie(null);
  };

  if (showBooking && selectedMovie) {
    return <BookingPage movie={selectedMovie} onBack={handleBackToHome} />;
  }

  return (
    <div className="homepage-container">
      {/* Professional Header */}
      <header className="professional-header">
        <div className="header-content">
          <div className="brand-section">
            <div className="logo-container">
              <div className="logo-icon">🎬</div>
              <div className="brand-text">
                <h1>RTX Cinema</h1>
                <span className="tagline">Premium Movie Experience</span>
              </div>
            </div>
          </div>

          <nav className="main-navigation">
            <button 
              className={`nav-link ${selectedCategory === 'now-showing' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('now-showing')}
            >
              Now Showing
            </button>
            <button 
              className={`nav-link ${selectedCategory === 'coming-soon' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('coming-soon')}
            >
              Coming Soon
            </button>
            <button 
              className={`nav-link ${selectedCategory === 'top-rated' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('top-rated')}
            >
              Top Rated
            </button>
            <button className="nav-link">Cinemas</button>
            <button className="nav-link">Offers</button>
          </nav>

          <div className="header-actions">
            <div className="search-container">
              <input 
                type="text" 
                placeholder="Search movies, cinemas..." 
                className="search-input"
              />
              <button className="search-button">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
                  <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </button>
            </div>
            
            <div className="user-section">
              <div className="location-selector">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" stroke="currentColor" strokeWidth="2"/>
                  <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2"/>
                </svg>
                <span>Kathmandu</span>
              </div>
              
              <div className="user-menu">
                <div className="user-avatar">
                  <span>{(user?.name || user?.login || 'U')[0].toUpperCase()}</span>
                </div>
                <div className="user-info">
                  <span className="user-name">{user?.name || user?.login || 'User'}</span>
                  <button className="logout-btn" onClick={onLogout}>Logout</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      {featuredMovie && (
        <section className="hero-section">
          <div className="hero-background">
            <img src={featuredMovie.image} alt={featuredMovie.title} />
            <div className="hero-overlay"></div>
          </div>
          <div className="hero-content">
            <div className="hero-info">
              <div className="movie-badges">
                <span className="badge featured">Featured</span>
                <span className="badge rating">⭐ {featuredMovie.rating}</span>
              </div>
              <h1 className="hero-title">{featuredMovie.title}</h1>
              <p className="hero-description">
                Experience the ultimate cinematic adventure with stunning visuals and immersive sound. 
                Don't miss this blockbuster hit now showing at RTX Cinema.
              </p>
              <div className="hero-meta">
                <span className="genre">{featuredMovie.genre}</span>
                <span className="separator">•</span>
                <span className="year">{featuredMovie.year}</span>
                <span className="separator">•</span>
                <span className="duration">2h 28m</span>
              </div>
              <div className="hero-actions">
                <button 
                  className="book-now-btn"
                  onClick={() => handleMovieClick(featuredMovie)}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
                    <line x1="8" y1="21" x2="16" y2="21" stroke="currentColor" strokeWidth="2"/>
                    <line x1="12" y1="17" x2="12" y2="21" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                  Book Tickets
                </button>
                <button className="watch-trailer-btn">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <polygon points="5,3 19,12 5,21" fill="currentColor"/>
                  </svg>
                  Watch Trailer
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Cinema Locations */}
      <section className="cinema-locations">
        <div className="container">
          <h2 className="section-title">Our Premium Locations</h2>
          <div className="locations-grid">
            <div className="location-card">
              <div className="location-icon">🏢</div>
              <h3>QFX Jai Nepal</h3>
              <p>Chabahil, Kathmandu</p>
              <span className="halls">3 Premium Halls</span>
            </div>
            <div className="location-card">
              <div className="location-icon">🎭</div>
              <h3>FCube Labim Mall</h3>
              <p>Lalitpur, Pulchowk</p>
              <span className="halls">2 IMAX Halls</span>
            </div>
            <div className="location-card">
              <div className="location-icon">🎪</div>
              <h3>Big Movies Civil Mall</h3>
              <p>Sundhara, Kathmandu</p>
              <span className="halls">4 Regular Halls</span>
            </div>
          </div>
        </div>
      </section>

      {/* Movies Section */}
      <section className="movies-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">
              {selectedCategory === 'now-showing' ? 'Now Showing' : 
               selectedCategory === 'coming-soon' ? 'Coming Soon' : 
               selectedCategory === 'top-rated' ? 'Top Rated Movies' : 'Movies'}
            </h2>
            <div className="view-controls">
              <button className="view-btn active">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="3" width="7" height="7" stroke="currentColor" strokeWidth="2"/>
                  <rect x="14" y="3" width="7" height="7" stroke="currentColor" strokeWidth="2"/>
                  <rect x="14" y="14" width="7" height="7" stroke="currentColor" strokeWidth="2"/>
                  <rect x="3" y="14" width="7" height="7" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </button>
              <button className="view-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <line x1="8" y1="6" x2="21" y2="6" stroke="currentColor" strokeWidth="2"/>
                  <line x1="8" y1="12" x2="21" y2="12" stroke="currentColor" strokeWidth="2"/>
                  <line x1="8" y1="18" x2="21" y2="18" stroke="currentColor" strokeWidth="2"/>
                  <line x1="3" y1="6" x2="3.01" y2="6" stroke="currentColor" strokeWidth="2"/>
                  <line x1="3" y1="12" x2="3.01" y2="12" stroke="currentColor" strokeWidth="2"/>
                  <line x1="3" y1="18" x2="3.01" y2="18" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </button>
            </div>
          </div>

          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading movies...</p>
            </div>
          ) : movies.length === 0 ? (
            <div className="no-movies">
              <div className="no-movies-icon">🎬</div>
              <h3>No Movies Available</h3>
              <p>Please check back later or try a different category.</p>
            </div>
          ) : (
            <div className="movies-grid">
              {movies.map((movie) => (
                <div 
                  key={movie._id} 
                  className="professional-movie-card"
                  onClick={() => handleMovieClick(movie)}
                >
                  <div className="movie-poster">
                    <img src={movie.image} alt={movie.title} />
                    <div className="movie-overlay">
                      <div className="overlay-content">
                        <button className="quick-book-btn">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <rect x="2" y="3" width="20" height="14" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
                            <line x1="8" y1="21" x2="16" y2="21" stroke="currentColor" strokeWidth="2"/>
                            <line x1="12" y1="17" x2="12" y2="21" stroke="currentColor" strokeWidth="2"/>
                          </svg>
                          Quick Book
                        </button>
                        <div className="movie-rating">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="#FFD700">
                            <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
                          </svg>
                          <span>{movie.rating}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="movie-info">
                    <h3 className="movie-title">{movie.title}</h3>
                    <div className="movie-meta">
                      <span className="genre">{movie.genre}</span>
                      <span className="year">{movie.year}</span>
                    </div>
                    <div className="movie-showtimes">
                      <span className="showtime">10:30 AM</span>
                      <span className="showtime">2:15 PM</span>
                      <span className="showtime">6:00 PM</span>
                      <span className="showtime">9:45 PM</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="professional-footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <div className="footer-brand">
                <div className="footer-logo">
                  <div className="logo-icon">🎬</div>
                  <span>RTX Cinema</span>
                </div>
                <p>Nepal's premier cinema chain delivering world-class movie experiences with cutting-edge technology and premium comfort.</p>
                <div className="social-links">
                  <a href="#" className="social-link">📘</a>
                  <a href="#" className="social-link">📷</a>
                  <a href="#" className="social-link">🐦</a>
                  <a href="#" className="social-link">📺</a>
                </div>
              </div>
            </div>
            
            <div className="footer-section">
              <h4>Quick Links</h4>
              <ul>
                <li><a href="#">Now Showing</a></li>
                <li><a href="#">Coming Soon</a></li>
                <li><a href="#">Cinema Locations</a></li>
                <li><a href="#">Gift Cards</a></li>
                <li><a href="#">Corporate Bookings</a></li>
              </ul>
            </div>
            
            <div className="footer-section">
              <h4>Support</h4>
              <ul>
                <li><a href="#">Help Center</a></li>
                <li><a href="#">Booking Guide</a></li>
                <li><a href="#">Cancellation Policy</a></li>
                <li><a href="#">Terms & Conditions</a></li>
                <li><a href="#">Privacy Policy</a></li>
              </ul>
            </div>
            
            <div className="footer-section">
              <h4>Contact Us</h4>
              <div className="contact-info">
                <div className="contact-item">
                  <span className="contact-icon">📞</span>
                  <span>+977-1-4444444</span>
                </div>
                <div className="contact-item">
                  <span className="contact-icon">📧</span>
                  <span>info@rtxcinema.com</span>
                </div>
                <div className="contact-item">
                  <span className="contact-icon">📍</span>
                  <span>Kathmandu, Nepal</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="footer-bottom">
            <div className="footer-bottom-content">
              <p>&copy; 2024 RTX Cinema. All rights reserved.</p>
              <div className="footer-links">
                <a href="#">Privacy Policy</a>
                <a href="#">Terms of Service</a>
                <a href="#">Cookie Policy</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}