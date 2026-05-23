import { useState, useEffect } from "react";
import "./HomePage.css";
import BookingPage from "./BookingPage";
import ProfilePage from "./ProfilePage";
import MyBookingsPage from "./MyBookingsPage";
import FavoritesPage from "./FavoritesPage";
import SettingsPage from "./SettingsPage";
import HelpSupportPage from "./HelpSupportPage";
import LoyaltyPage from "./LoyaltyPage";
import FloatingActionButtons from "../components/FloatingActionButtons";
import logo from "../assets/logo.png";
import FeedbackModal from "../components/FeedbackModal";
import QuickBookModal from "../components/QuickBookModal";

export default function HomePage({ user, onLogout }) {
  const [selectedCategory, setSelectedCategory] = useState("now-showing");
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [showBooking, setShowBooking] = useState(false);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [featuredMovie, setFeaturedMovie] = useState(null);
  const [featuredMovies, setFeaturedMovies] = useState([]);
  const [currentFeaturedIndex, setCurrentFeaturedIndex] = useState(0);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [allMovies, setAllMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState('home'); // home, profile, bookings, favorites, settings, help
  const [loyaltyRefreshKey, setLoyaltyRefreshKey] = useState(0);
  const [lastEarnedPoints, setLastEarnedPoints] = useState(0);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showQuickBookModal, setShowQuickBookModal] = useState(false);

  // Fetch movies when category changes
  useEffect(() => {
    fetchMovies();
  }, [selectedCategory]);

  // Fetch all movies for search on initial load
  useEffect(() => {
    fetchAllMovies();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showProfileDropdown && !event.target.closest('.profile-dropdown-container')) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showProfileDropdown]);

  // Auto-slide hero carousel every 3 seconds
  useEffect(() => {
    if (featuredMovies.length <= 1) return; // Don't auto-slide if only one movie

    const interval = setInterval(() => {
      setCurrentFeaturedIndex((prevIndex) => {
        const newIndex = prevIndex === featuredMovies.length - 1 ? 0 : prevIndex + 1;
        setFeaturedMovie(featuredMovies[newIndex]);
        return newIndex;
      });
    }, 3000); // 3 seconds

    return () => clearInterval(interval);
  }, [featuredMovies]);

  const fetchAllMovies = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/movies');
      const data = await response.json();
      
      if (data.success && data.movies) {
        setAllMovies(data.movies);
      } else {
        console.error('Failed to fetch movies:', data.message);
        setAllMovies([]);
      }
    } catch (error) {
      console.error('Error fetching all movies:', error);
      setAllMovies([]);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    
    if (query.trim() === '') {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    
    // Use allMovies if available, otherwise fallback to current movies
    const moviesToSearch = allMovies.length > 0 ? allMovies : movies;
    
    // Filter movies based on search query with improved matching
    const searchTerm = query.toLowerCase().trim();
    const filtered = moviesToSearch.filter(movie => {
      // Title matching (most important)
      const titleMatch = movie.title && movie.title.toLowerCase().includes(searchTerm);
      
      // Genre matching (split by comma, bullet, or other separators)
      const genreMatch = movie.genre && movie.genre.toLowerCase().replace(/[•,]/g, ' ').includes(searchTerm);
      
      // Director matching
      const directorMatch = movie.director && movie.director.toLowerCase().includes(searchTerm);
      
      // Cast matching (handle both array and string formats)
      let castMatch = false;
      if (movie.cast) {
        if (Array.isArray(movie.cast)) {
          castMatch = movie.cast.some(actor => 
            actor && actor.toLowerCase().includes(searchTerm)
          );
        } else if (typeof movie.cast === 'string') {
          castMatch = movie.cast.toLowerCase().includes(searchTerm);
        }
      }
      
      // Year matching
      const yearMatch = movie.year && movie.year.toString().includes(searchTerm);
      
      // Category matching
      const categoryMatch = movie.category && movie.category.toLowerCase().includes(searchTerm);
      
      return titleMatch || genreMatch || directorMatch || castMatch || yearMatch || categoryMatch;
    });
    
    setSearchResults(filtered);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setIsSearching(false);
  };

  const fetchMovies = async () => {
    setLoading(true);
    try {
      let apiUrl = `http://localhost:5000/api/movies`;
      
      if (selectedCategory === 'now-showing') {
        apiUrl = `http://localhost:5000/api/movies/now-showing`;
      } else if (selectedCategory === 'top-rated') {
        apiUrl = `http://localhost:5000/api/movies/top-rated`;
      } else if (selectedCategory === 'coming-soon') {
        // Fetch all movies and filter those marked as coming soon
        apiUrl = `http://localhost:5000/api/movies`;
      } else {
        apiUrl = `http://localhost:5000/api/movies?category=${selectedCategory}&limit=20`;
      }
      
      const response = await fetch(apiUrl);
      const data = await response.json();
      
      if (data.success) {
        let filteredMovies = data.movies;
        
        // For coming-soon, filter movies marked as comingSoon
        if (selectedCategory === 'coming-soon') {
          filteredMovies = data.movies.filter(movie => movie.comingSoon === true);
        } else if (selectedCategory === 'now-showing') {
          // For now-showing, exclude movies marked as comingSoon
          filteredMovies = data.movies.filter(movie => movie.comingSoon !== true);
        }
        
        setMovies(filteredMovies);
        // Get top 5 movies for featured carousel
        const topMovies = [...filteredMovies]
          .sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating))
          .slice(0, 5);
        setFeaturedMovies(topMovies);
        setFeaturedMovie(topMovies[0]);
        setCurrentFeaturedIndex(0);
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
    // Read points earned from last booking (set by PaymentPage)
    const earned = parseInt(sessionStorage.getItem('lastEarnedPoints') || '0', 10);
    setLastEarnedPoints(earned);
    sessionStorage.removeItem('lastEarnedPoints');
    setLoyaltyRefreshKey(k => k + 1);
    setCurrentPage('home');
  };

  const handleProfileNavigation = (page) => {
    setShowProfileDropdown(false);
    setCurrentPage(page);
  };

  // FAB Handlers
  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleQuickBook = () => {
    setShowQuickBookModal(true);
  };

  const handleHelp = () => {
    setCurrentPage('help');
  };

  const handleFeedback = () => {
    setShowFeedbackModal(true);
  };

  // Hero carousel navigation
  const handlePrevFeatured = () => {
    const newIndex = currentFeaturedIndex === 0 ? featuredMovies.length - 1 : currentFeaturedIndex - 1;
    setCurrentFeaturedIndex(newIndex);
    setFeaturedMovie(featuredMovies[newIndex]);
  };

  const handleNextFeatured = () => {
    const newIndex = currentFeaturedIndex === featuredMovies.length - 1 ? 0 : currentFeaturedIndex + 1;
    setCurrentFeaturedIndex(newIndex);
    setFeaturedMovie(featuredMovies[newIndex]);
  };

  const handleQuickBookMovieSelect = (movie) => {
    handleMovieClick(movie);
  };

  if (showBooking && selectedMovie) {
    return <BookingPage movie={selectedMovie} onBack={handleBackToHome} />;
  }

  // Handle different page navigation
  if (currentPage === 'profile') {
    return <ProfilePage user={user} onBack={handleBackToHome} />;
  }
  
  if (currentPage === 'bookings') {
    return <MyBookingsPage user={user} onBack={handleBackToHome} />;
  }
  
  if (currentPage === 'favorites') {
    return <FavoritesPage user={user} onBack={handleBackToHome} onMovieClick={handleMovieClick} />;
  }
  
  if (currentPage === 'settings') {
    return <SettingsPage user={user} onBack={handleBackToHome} />;
  }
  
  if (currentPage === 'help') {
    return <HelpSupportPage user={user} onBack={handleBackToHome} />;
  }

  if (currentPage === 'loyalty') {
    return <LoyaltyPage key={loyaltyRefreshKey} user={user} onBack={handleBackToHome} newPoints={lastEarnedPoints} />;
  }

  // Determine which movies to display
  const displayMovies = isSearching ? searchResults : movies;

  return (
    <div className="homepage-container">
      {/* Professional Header */}
      <header className="professional-header">
        <div className="header-content">
          <div className="brand-section">
            <div className="logo-container">
              <div className="logo-icon">
                <img src={logo} alt="RTX Cinema Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              </div>
            
            </div>
          </div>

          <nav className="main-navigation">
            <button 
              className={`nav-link ${selectedCategory === 'now-showing' ? 'active' : ''}`}
              onClick={() => {
                setSelectedCategory('now-showing');
                clearSearch();
              }}
            >
              Now Showing
            </button>
            <button 
              className={`nav-link ${selectedCategory === 'coming-soon' ? 'active' : ''}`}
              onClick={() => {
                setSelectedCategory('coming-soon');
                clearSearch();
              }}
            >
              Coming Soon
            </button>
            <button 
              className={`nav-link ${selectedCategory === 'top-rated' ? 'active' : ''}`}
              onClick={() => {
                setSelectedCategory('top-rated');
                clearSearch();
              }}
            >
              Top Rated
            </button>
            <button className="nav-link">Cinemas</button>
            <button className="nav-link">Offers</button>
            <button
              className={`nav-link ${currentPage === 'loyalty' ? 'active' : ''}`}
              onClick={() => { setCurrentPage('loyalty'); clearSearch(); }}
            >
              Loyalty
            </button>
          </nav>

          <div className="header-actions">
            <div className="search-container">
              <input 
                type="text" 
                placeholder="Search movies by title, genre, cast..." 
                className="search-input"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
              />
              <button className={`search-button ${isSearching ? 'searching' : ''}`}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
                  <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </button>
              {searchQuery && (
                <button className="clear-search-btn" onClick={clearSearch}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2"/>
                    <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </button>
              )}
            </div>
            
            <div className="user-section">
              <div className="location-selector">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" stroke="currentColor" strokeWidth="2"/>
                  <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2"/>
                </svg>
                <span>Kathmandu</span>
              </div>
              
              <div className="profile-dropdown-container">
                <div 
                  className="user-menu"
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                >
                  <div className="user-avatar">
                    <span>{(user?.name || user?.login || 'U')[0].toUpperCase()}</span>
                  </div>
                  <div className="user-info">
                    <span className="user-name">{user?.name || user?.login || 'User'}</span>
                    <span className="user-role">Premium Member</span>
                  </div>
                  <svg 
                    width="16" 
                    height="16" 
                    viewBox="0 0 24 24" 
                    fill="none"
                    className={`dropdown-arrow ${showProfileDropdown ? 'open' : ''}`}
                  >
                    <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </div>

                {showProfileDropdown && (
                  <div className="profile-dropdown">
                    <div className="dropdown-header">
                      <div className="dropdown-avatar">
                        <span>{(user?.name || user?.login || 'U')[0].toUpperCase()}</span>
                      </div>
                      <div className="dropdown-user-info">
                        <h4>{user?.name || user?.login || 'User'}</h4>
                        <p>{user?.email || 'user@rtxcinema.com'}</p>
                      </div>
                    </div>
                    
                    <div className="dropdown-divider"></div>
                    
                    <div className="dropdown-menu">
                      <button 
                        className="dropdown-item"
                        onClick={() => handleProfileNavigation('profile')}
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2"/>
                          <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                        <span>My Profile</span>
                      </button>
                      
                      <button 
                        className="dropdown-item"
                        onClick={() => handleProfileNavigation('bookings')}
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                          <rect x="2" y="3" width="20" height="14" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
                          <line x1="8" y1="21" x2="16" y2="21" stroke="currentColor" strokeWidth="2"/>
                          <line x1="12" y1="17" x2="12" y2="21" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                        <span>My Bookings</span>
                      </button>

                      <button
                        className="dropdown-item"
                        onClick={() => handleProfileNavigation('loyalty')}
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                        <span>Loyalty Rewards</span>
                      </button>
                      
                      <button 
                        className="dropdown-item"
                        onClick={() => handleProfileNavigation('favorites')}
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7Z" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                        <span>Favorites</span>
                      </button>
                      
                      <button 
                        className="dropdown-item"
                        onClick={() => handleProfileNavigation('settings')}
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                          <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                          <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                        <span>Settings</span>
                      </button>
                      
                      <button 
                        className="dropdown-item"
                        onClick={() => handleProfileNavigation('help')}
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="currentColor" strokeWidth="2"/>
                          <polyline points="16,17 21,12 16,7" stroke="currentColor" strokeWidth="2"/>
                          <line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                        <span>Help & Support</span>
                      </button>
                    </div>
                    
                    <div className="dropdown-divider"></div>
                    
                    <button className="dropdown-item logout-item" onClick={onLogout}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="currentColor" strokeWidth="2"/>
                        <polyline points="16,17 21,12 16,7" stroke="currentColor" strokeWidth="2"/>
                        <line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" strokeWidth="2"/>
                      </svg>
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section - Only show when not searching */}
      {!isSearching && featuredMovie && (
        <section className="hero-section">
          <div className="hero-background">
            <img src={featuredMovie.image} alt={featuredMovie.title} />
            <div className="hero-overlay"></div>
          </div>
          
          {/* Navigation Arrows */}
          {featuredMovies.length > 1 && (
            <>
              <button 
                className="hero-nav-btn hero-nav-prev" 
                onClick={handlePrevFeatured}
                aria-label="Previous movie"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <button 
                className="hero-nav-btn hero-nav-next" 
                onClick={handleNextFeatured}
                aria-label="Next movie"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </>
          )}
          
          {/* Carousel Indicators */}
          {featuredMovies.length > 1 && (
            <div className="hero-indicators">
              {featuredMovies.map((_, index) => (
                <button
                  key={index}
                  className={`hero-indicator ${index === currentFeaturedIndex ? 'active' : ''}`}
                  onClick={() => {
                    setCurrentFeaturedIndex(index);
                    setFeaturedMovie(featuredMovies[index]);
                  }}
                  aria-label={`Go to movie ${index + 1}`}
                />
              ))}
            </div>
          )}
          
          <div className="hero-content">
            <div className="hero-info">
              <div className="movie-badges">
                <span className="badge featured">Featured</span>
                <span className="badge rating">{featuredMovie.rating}</span>
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

      {/* Cinema Locations - Only show when not searching */}
      {!isSearching && (
        <section className="cinema-locations">
          <div className="container">
            <h2 className="section-title">Our Premium Locations</h2>
            <div className="locations-grid">
              <div className="location-card">
                <div className="location-icon"></div>
                <h3>QFX Jai Nepal</h3>
                <p>Chabahil, Kathmandu</p>
                <span className="halls">3 Premium Halls</span>
              </div>
              <div className="location-card">
                <div className="location-icon"></div>
                <h3>FCube Labim Mall</h3>
                <p>Lalitpur, Pulchowk</p>
                <span className="halls">2 IMAX Halls</span>
              </div>
              <div className="location-card">
                <div className="location-icon"></div>
                <h3>Big Movies Civil Mall</h3>
                <p>Sundhara, Kathmandu</p>
                <span className="halls">4 Regular Halls</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Movies Section */}
      <section className="movies-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">
              {isSearching ? `Search Results for "${searchQuery}"` :
               selectedCategory === 'now-showing' ? 'Now Showing' : 
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
          ) : displayMovies.length === 0 ? (
            <div className="no-movies">
              <div className="no-movies-icon"></div>
              <h3>{isSearching ? 'No Movies Found' : 'No Movies Available'}</h3>
              <p>
                {isSearching 
                  ? `No movies found matching "${searchQuery}". Try searching with different keywords.`
                  : 'Please check back later or try a different category.'
                }
              </p>
              {isSearching && (
                <button className="clear-search-button" onClick={clearSearch}>
                  Clear Search
                </button>
              )}
            </div>
          ) : (
            <div className="movies-grid">
              {displayMovies.map((movie) => (
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

      {/* Footer - Only show when not searching */}
      {!isSearching && (
        <footer className="professional-footer">
          <div className="container">
            <div className="footer-content">
              <div className="footer-section">
                <div className="footer-brand">
                  <div className="footer-logo">
                    <div className="logo-icon">
                      <img src={logo} alt="RTX Cinema Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                    </div>
                    <span>RTX Cinema</span>
                  </div>
                  <p>Nepal's premier cinema chain delivering world-class movie experiences with cutting-edge technology and premium comfort.</p>
                  <div className="social-links">
                    <a href="#" className="social-link">FB</a>
                    <a href="#" className="social-link">IG</a>
                    <a href="#" className="social-link">TW</a>
                    <a href="#" className="social-link">YT</a>
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
                    <span className="contact-icon"></span>
                    <span>+977-1-4444444</span>
                  </div>
                  <div className="contact-item">
                    <span className="contact-icon"></span>
                    <span>info@rtxcinema.com</span>
                  </div>
                  <div className="contact-item">
                    <span className="contact-icon"></span>
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
      )}

      {/* Floating Action Buttons */}
      <FloatingActionButtons
        onScrollToTop={handleScrollToTop}
        onQuickBook={handleQuickBook}
        onHelp={handleHelp}
        onFeedback={handleFeedback}
        currentPage={currentPage}
      />

      {/* Feedback Modal */}
      <FeedbackModal
        isOpen={showFeedbackModal}
        onClose={() => setShowFeedbackModal(false)}
      />

      {/* Quick Book Modal */}
      <QuickBookModal
        isOpen={showQuickBookModal}
        onClose={() => setShowQuickBookModal(false)}
        onSelectMovie={handleQuickBookMovieSelect}
      />
    </div>
  );
}