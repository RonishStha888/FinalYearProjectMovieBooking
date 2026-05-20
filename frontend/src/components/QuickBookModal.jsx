import { useState, useEffect } from 'react';
import './QuickBookModal.css';

const QuickBookModal = ({ isOpen, onClose, onSelectMovie }) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('now-showing');

  useEffect(() => {
    if (isOpen) {
      fetchMovies();
    }
  }, [isOpen, selectedCategory]);

  const fetchMovies = async () => {
    setLoading(true);
    try {
      let apiUrl = `http://localhost:5000/api/movies`;
      
      if (selectedCategory === 'now-showing') {
        apiUrl = `http://localhost:5000/api/movies/now-showing`;
      } else if (selectedCategory === 'top-rated') {
        apiUrl = `http://localhost:5000/api/movies/top-rated`;
      } else {
        apiUrl = `http://localhost:5000/api/movies?category=${selectedCategory}&limit=12`;
      }
      
      const response = await fetch(apiUrl);
      const data = await response.json();
      
      if (data.success) {
        setMovies(data.movies);
      } else {
        setMovies([]);
      }
    } catch (error) {
      console.error('Error fetching movies:', error);
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredMovies = searchQuery.trim()
    ? movies.filter(movie =>
        movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        movie.genre.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : movies;

  const handleMovieSelect = (movie) => {
    const movieWithId = { ...movie, id: movie._id };
    onSelectMovie(movieWithId);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="quick-book-modal-overlay" onClick={onClose}>
      <div className="quick-book-modal" onClick={(e) => e.stopPropagation()}>
        <button className="quick-book-close-btn" onClick={onClose} aria-label="Close">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2"/>
            <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2"/>
          </svg>
        </button>

        <div className="quick-book-header">
          <div className="quick-book-icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
              <line x1="8" y1="21" x2="16" y2="21" stroke="currentColor" strokeWidth="2"/>
              <line x1="12" y1="17" x2="12" y2="21" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </div>
          <h2>Quick Book Tickets</h2>
          <p>Select a movie to start booking</p>
        </div>

        <div className="quick-book-filters">
          <div className="search-box">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
              <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2"/>
            </svg>
            <input
              type="text"
              placeholder="Search movies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="category-tabs">
            <button
              className={`category-tab ${selectedCategory === 'now-showing' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('now-showing')}
            >
              Now Showing
            </button>
            <button
              className={`category-tab ${selectedCategory === 'top-rated' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('top-rated')}
            >
              Top Rated
            </button>
            <button
              className={`category-tab ${selectedCategory === 'coming-soon' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('coming-soon')}
            >
              Coming Soon
            </button>
          </div>
        </div>

        <div className="quick-book-content">
          {loading ? (
            <div className="quick-book-loading">
              <div className="loading-spinner"></div>
              <p>Loading movies...</p>
            </div>
          ) : filteredMovies.length === 0 ? (
            <div className="quick-book-empty">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
                <line x1="8" y1="21" x2="16" y2="21" stroke="currentColor" strokeWidth="2"/>
                <line x1="12" y1="17" x2="12" y2="21" stroke="currentColor" strokeWidth="2"/>
              </svg>
              <h3>No Movies Found</h3>
              <p>Try adjusting your search or category</p>
            </div>
          ) : (
            <div className="quick-book-grid">
              {filteredMovies.slice(0, 8).map((movie) => (
                <div
                  key={movie._id}
                  className="quick-book-card"
                  onClick={() => handleMovieSelect(movie)}
                >
                  <div className="quick-book-poster">
                    <img src={movie.image} alt={movie.title} />
                    <div className="quick-book-overlay">
                      <button className="book-btn">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                          <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Book Now
                      </button>
                    </div>
                  </div>
                  <div className="quick-book-info">
                    <h4>{movie.title}</h4>
                    <div className="quick-book-meta">
                      <span className="rating">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="#FFD700">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                        {movie.rating}
                      </span>
                      <span className="genre">{movie.genre.split(',')[0]}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuickBookModal;
