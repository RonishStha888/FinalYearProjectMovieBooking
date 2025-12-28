import { useState, useEffect } from "react";
import "./HomePage.css";
import BookingPage from "./BookingPage";

export default function HomePage({ user, onLogout }) {
  const [selectedCategory, setSelectedCategory] = useState("top-rated");
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [showBooking, setShowBooking] = useState(false);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch movies when category changes
  useEffect(() => {
    fetchMovies();
  }, [selectedCategory]);

  const fetchMovies = async () => {
    setLoading(true);
    try {
      let apiUrl = `http://localhost:5000/api/movies`;
      
      // Use specific endpoints for better movie data
      if (selectedCategory === 'top-rated') {
        apiUrl = `http://localhost:5000/api/movies/top-rated`;
      } else if (selectedCategory === 'action' || selectedCategory === 'coming-soon') {
        apiUrl = `http://localhost:5000/api/movies/now-showing`;
      } else {
        apiUrl = `http://localhost:5000/api/movies?category=${selectedCategory}&limit=20`;
      }
      
      const response = await fetch(apiUrl);
      const data = await response.json();
      
      if (data.success) {
        setMovies(data.movies);
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
    // Convert MongoDB _id to id for compatibility
    const movieWithId = { ...movie, id: movie._id };
    setSelectedMovie(movieWithId);
    setShowBooking(true);
  };

  const handleBackToHome = () => {
    setShowBooking(false);
    setSelectedMovie(null);
  };

  // If booking page is shown, render it instead
  if (showBooking && selectedMovie) {
    return <BookingPage movie={selectedMovie} onBack={handleBackToHome} />;
  }

  // Get top rated movies for the special section
  const topRatedMovies = movies.filter(movie => movie.category === 'top-rated').slice(0, 4);
  const displayMovies = movies;

  return (
    <div className="home-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo">
          <h2>🎬 RTX Cinema</h2>
        </div>

        <nav className="nav-menu">
          <div className="nav-section">
            <h3>MENU</h3>
            <button className="nav-item">
              <span className="icon">🔍</span>
              Discovery
            </button>
            <button 
              className={`nav-item ${selectedCategory === 'top-rated' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('top-rated')}
            >
              <span className="icon">⭐</span>
              Top Rated
            </button>
            <button 
              className={`nav-item ${selectedCategory === 'coming-soon' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('coming-soon')}
            >
              <span className="icon">🕐</span>
              Coming Soon
            </button>
          </div>

          <div className="nav-section">
            <h3>LIBRARY</h3>
            <button className="nav-item">
              <span className="icon">🎬</span>
              Recent Played
            </button>
            <button className="nav-item">
              <span className="icon">📥</span>
              Download
            </button>
          </div>

          <div className="nav-section">
            <button className="nav-item">
              <span className="icon">🌙</span>
              Dark Mode
            </button>
            <button className="nav-item">
              <span className="icon">⚙️</span>
              Setting
            </button>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* Header */}
        <header className="header">
          <nav className="header-nav">
            <button 
              className={selectedCategory === 'top-rated' ? 'active' : ''}
              onClick={() => setSelectedCategory('top-rated')}
            >
              Movies
            </button>
            <button 
              className={selectedCategory === 'action' ? 'active' : ''}
              onClick={() => setSelectedCategory('action')}
            >
              Series
            </button>
            <button>Animation</button>
            <button>Genres</button>
          </nav>

          <div className="header-actions">
            <button className="search-btn">🔍</button>
            <button className="subscribe-btn">Subscribe</button>
            <button className="notification-btn">
              🔔
              <span className="badge">2</span>
            </button>
            <div className="user-menu">
              <span className="user-name">{user?.name || user?.login || 'User'}</span>
              <button className="logout-btn" onClick={onLogout}>Logout</button>
            </div>
          </div>
        </header>

        {/* Top Rated Section */}
        {selectedCategory === 'top-rated' && (
          <section className="top-rated-section">
            <h2>Top Rated</h2>
            {loading ? (
              <div className="loading-message">Loading top rated movies...</div>
            ) : topRatedMovies.length === 0 ? (
              <div className="no-movies">No top rated movies found.</div>
            ) : (
              <div className="top-rated-grid">
                {topRatedMovies.map((movie, index) => (
                  <div 
                    key={movie._id} 
                    className="top-rated-card"
                    onClick={() => handleMovieClick(movie)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="rank">{index + 1}</div>
                    <img src={movie.image} alt={movie.title} />
                    <div className="movie-info">
                      <span className="year">pg-{movie.year.slice(2)}</span>
                      <h3>{movie.title}</h3>
                      <p className="genre">{movie.genre}</p>
                      <div className="rating">
                        <span className="star">⭐</span>
                        {movie.rating}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Movies Section */}
        <section className="movies-section">
          <h2>
            {selectedCategory === 'action' ? 'Best of Action' : 
             selectedCategory === 'coming-soon' ? 'Coming Soon' : 
             'Best of Action'}
          </h2>
          {loading ? (
            <div className="loading-message">Loading movies...</div>
          ) : displayMovies.length === 0 ? (
            <div className="no-movies">No movies found. Make sure the backend is running and seeded with data.</div>
          ) : (
            <div className="movies-grid">
              {displayMovies.map((movie) => (
                <div 
                  key={movie._id} 
                  className="movie-card"
                  onClick={() => handleMovieClick(movie)}
                  style={{ cursor: 'pointer' }}
                >
                  <img src={movie.image} alt={movie.title} />
                  <div className="movie-overlay">
                    <button className="play-btn">▶</button>
                  </div>
                  <div className="movie-details">
                    <h3>{movie.title}</h3>
                    <div className="movie-meta">
                      {movie.rating !== "N/A" && (
                        <span className="rating">
                          <span className="star">⭐</span>
                          {movie.rating}
                        </span>
                      )}
                      <span className="genre">{movie.genre}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
