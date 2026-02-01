import { useState, useEffect } from "react";
import "./FavoritesPage.css";

export default function FavoritesPage({ user, onBack, onMovieClick }) {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      // Mock favorites data - in a real app, you'd fetch from your API
      const mockFavorites = [
        {
          _id: '1',
          title: 'Spider-Man: No Way Home',
          genre: 'Action • Adventure • Sci-Fi',
          rating: 8.2,
          year: '2021',
          image: 'https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg',
          synopsis: 'With Spider-Man\'s identity now revealed, Peter asks Doctor Strange for help.',
          addedDate: '2024-02-10'
        },
        {
          _id: '2',
          title: 'Avatar: The Way of Water',
          genre: 'Action • Adventure • Sci-Fi',
          rating: 7.6,
          year: '2022',
          image: 'https://image.tmdb.org/t/p/w500/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg',
          synopsis: 'Set more than a decade after the events of the first film.',
          addedDate: '2024-02-08'
        },
        {
          _id: '3',
          title: 'Top Gun: Maverick',
          genre: 'Action • Drama',
          rating: 8.3,
          year: '2022',
          image: 'https://image.tmdb.org/t/p/w500/62HCnUTziyWcpDaBO2i1DX17ljH.jpg',
          synopsis: 'After more than thirty years of service as one of the Navy\'s top aviators.',
          addedDate: '2024-02-05'
        },
        {
          _id: '4',
          title: 'The Batman',
          genre: 'Action • Crime • Drama',
          rating: 7.8,
          year: '2022',
          image: 'https://image.tmdb.org/t/p/w500/b0PlSFdDwbyK0cf5RxwDpaOJQvQ.jpg',
          synopsis: 'In his second year of fighting crime, Batman uncovers corruption in Gotham City.',
          addedDate: '2024-01-28'
        }
      ];
      
      setFavorites(mockFavorites);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromFavorites = async (movieId) => {
    if (window.confirm('Remove this movie from your favorites?')) {
      try {
        // In a real app, you'd call your API to remove from favorites
        setFavorites(prev => prev.filter(movie => movie._id !== movieId));
        alert('Movie removed from favorites!');
      } catch (error) {
        console.error('Error removing from favorites:', error);
        alert('Failed to remove from favorites. Please try again.');
      }
    }
  };

  const handleMovieClick = (movie) => {
    if (onMovieClick) {
      const movieWithId = { ...movie, id: movie._id };
      onMovieClick(movieWithId);
    }
  };

  return (
    <div className="favorites-page">
      <div className="favorites-header">
        <button className="back-button" onClick={onBack}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5" stroke="currentColor" strokeWidth="2"/>
            <path d="M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2"/>
          </svg>
          Back to Home
        </button>
        <h1>My Favorites</h1>
      </div>

      <div className="favorites-container">
        <div className="favorites-stats">
          <div className="stat-card">
            <div className="stat-icon">❤️</div>
            <div className="stat-info">
              <div className="stat-number">{favorites.length}</div>
              <div className="stat-label">Favorite Movies</div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">⭐</div>
            <div className="stat-info">
              <div className="stat-number">
                {favorites.length > 0 
                  ? (favorites.reduce((sum, movie) => sum + parseFloat(movie.rating), 0) / favorites.length).toFixed(1)
                  : '0.0'
                }
              </div>
              <div className="stat-label">Average Rating</div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">🎭</div>
            <div className="stat-info">
              <div className="stat-number">
                {[...new Set(favorites.flatMap(movie => 
                  movie.genre.split('•').map(g => g.trim())
                ))].length}
              </div>
              <div className="stat-label">Genres Liked</div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading your favorites...</p>
          </div>
        ) : favorites.length === 0 ? (
          <div className="no-favorites">
            <div className="no-favorites-icon">💔</div>
            <h3>No Favorites Yet</h3>
            <p>Start adding movies to your favorites by clicking the heart icon on any movie!</p>
            <button className="browse-movies-btn" onClick={onBack}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
                <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2"/>
              </svg>
              Browse Movies
            </button>
          </div>
        ) : (
          <div className="favorites-grid">
            {favorites.map((movie) => (
              <div key={movie._id} className="favorite-movie-card">
                <div className="movie-poster-container">
                  <img 
                    src={movie.image} 
                    alt={movie.title}
                    className="movie-poster"
                  />
                  <div className="movie-overlay">
                    <button 
                      className="book-now-btn"
                      onClick={() => handleMovieClick(movie)}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
                        <line x1="8" y1="21" x2="16" y2="21" stroke="currentColor" strokeWidth="2"/>
                        <line x1="12" y1="17" x2="12" y2="21" stroke="currentColor" strokeWidth="2"/>
                      </svg>
                      Book Now
                    </button>
                  </div>
                  <button 
                    className="remove-favorite-btn"
                    onClick={() => handleRemoveFromFavorites(movie._id)}
                    title="Remove from favorites"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7Z" fill="currentColor"/>
                    </svg>
                  </button>
                </div>
                
                <div className="movie-info">
                  <h3 className="movie-title">{movie.title}</h3>
                  <div className="movie-meta">
                    <span className="movie-year">{movie.year}</span>
                    <span className="movie-rating">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="#FFD700">
                        <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
                      </svg>
                      {movie.rating}
                    </span>
                  </div>
                  <p className="movie-genre">{movie.genre}</p>
                  <p className="movie-synopsis">{movie.synopsis}</p>
                  <div className="added-date">
                    Added on {new Date(movie.addedDate).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}