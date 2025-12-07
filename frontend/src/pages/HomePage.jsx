import { useState } from "react";
import "./HomePage.css";

export default function HomePage({ user, onLogout }) {
  const [selectedCategory, setSelectedCategory] = useState("top-rated");

  // Sample movie data
  const topRatedMovies = [
    { id: 1, title: "The Shawshank Redemption", rating: 9.2, genre: "Drama", year: "1994", image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=300" },
    { id: 2, title: "The Godfather", rating: 9.2, genre: "Crime • Drama", year: "1972", image: "https://images.unsplash.com/photo-1594908900066-3f47337549d8?w=300" },
    { id: 3, title: "The Dark Knight", rating: 9.0, genre: "Action • Crime", year: "2008", image: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=300" },
    { id: 4, title: "Pulp Fiction", rating: 8.9, genre: "Crime • Drama", year: "1994", image: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=300" },
  ];

  const actionMovies = [
    { id: 5, title: "Man from Toronto", rating: 4.8, genre: "Action • Movie", image: "https://images.unsplash.com/photo-1574267432644-f610f5ef2bf4?w=400" },
    { id: 6, title: "Extraction", rating: 4.8, genre: "Action • Movie", image: "https://images.unsplash.com/photo-1595769816263-9b910be24d5f?w=400" },
    { id: 7, title: "Godzilla: King of Monsters", rating: 4.6, genre: "Action • Movie", image: "https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=400" },
    { id: 8, title: "Jumanji: The Next Level", rating: 4.8, genre: "Action • Movie", image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400" },
    { id: 9, title: "Yakuza: Ruthless Operations", rating: 4.8, genre: "Action • Movie", image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400" },
    { id: 10, title: "Mechanic: Resurrection", rating: 4.6, genre: "Action • Movie", image: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400" },
    { id: 11, title: "The Pirates: The Last Royal", rating: 4.6, genre: "Action • Movie", image: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400" },
    { id: 12, title: "6 Underground", rating: 4.8, genre: "Action • Movie", image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400" },
  ];

  const comingSoonMovies = [
    { id: 13, title: "Avatar 3", rating: "N/A", genre: "Sci-Fi • Adventure", year: "2025", image: "https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=400" },
    { id: 14, title: "Dune: Part Three", rating: "N/A", genre: "Sci-Fi • Drama", year: "2026", image: "https://images.unsplash.com/photo-1574267432644-f610f5ef2bf4?w=400" },
    { id: 15, title: "Mission Impossible 8", rating: "N/A", genre: "Action • Thriller", year: "2025", image: "https://images.unsplash.com/photo-1595769816263-9b910be24d5f?w=400" },
    { id: 16, title: "Deadpool 3", rating: "N/A", genre: "Action • Comedy", year: "2024", image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400" },
  ];

  const getMovies = () => {
    switch (selectedCategory) {
      case "top-rated":
        return topRatedMovies;
      case "action":
        return actionMovies;
      case "coming-soon":
        return comingSoonMovies;
      default:
        return topRatedMovies;
    }
  };

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
            <div className="top-rated-grid">
              {topRatedMovies.map((movie, index) => (
                <div key={movie.id} className="top-rated-card">
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
          </section>
        )}

        {/* Best of Action Section */}
        <section className="movies-section">
          <h2>
            {selectedCategory === 'action' ? 'Best of Action' : 
             selectedCategory === 'coming-soon' ? 'Coming Soon' : 
             'Best of Action'}
          </h2>
          <div className="movies-grid">
            {getMovies().map((movie) => (
              <div key={movie.id} className="movie-card">
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
        </section>
      </main>
    </div>
  );
}
