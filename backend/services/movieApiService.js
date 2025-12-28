// TMDB API Service for Real Movie Data
// Note: For production, you should get your own API key from https://www.themoviedb.org/settings/api

const TMDB_API_KEY = 'demo_key'; // Replace with your actual TMDB API key
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

// For demo purposes, we'll use a curated list of popular movies with their TMDB data
// In production, you would fetch this from TMDB API

export const getCurrentMovies = () => {
  return [
    {
      title: "Spider-Man: No Way Home",
      genre: "Action • Adventure • Sci-Fi",
      duration: 148,
      rating: 8.2,
      year: "2021",
      image: "https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg",
      synopsis: "With Spider-Man's identity now revealed, Peter asks Doctor Strange for help. When a spell goes wrong, dangerous foes from other worlds start to appear, forcing Peter to discover what it truly means to be Spider-Man.",
      cast: ["Tom Holland", "Zendaya", "Benedict Cumberbatch", "Jacob Batalon", "Jon Favreau"],
      director: "Jon Watts",
      language: "English",
      category: "action",
      releaseDate: new Date('2021-12-17'),
      tmdbId: 634649
    },
    {
      title: "Top Gun: Maverick",
      genre: "Action • Drama",
      duration: 130,
      rating: 8.3,
      year: "2022",
      image: "https://image.tmdb.org/t/p/w500/62HCnUTziyWcpDaBO2i1DX17ljH.jpg",
      synopsis: "After more than thirty years of service as one of the Navy's top aviators, Pete Mitchell is where he belongs, pushing the envelope as a courageous test pilot and dodging the advancement in rank that would ground him.",
      cast: ["Tom Cruise", "Miles Teller", "Jennifer Connelly", "Jon Hamm", "Glen Powell"],
      director: "Joseph Kosinski",
      language: "English",
      category: "top-rated",
      releaseDate: new Date('2022-05-27'),
      tmdbId: 361743
    },
    {
      title: "Avatar: The Way of Water",
      genre: "Action • Adventure • Sci-Fi",
      duration: 192,
      rating: 7.6,
      year: "2022",
      image: "https://image.tmdb.org/t/p/w500/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg",
      synopsis: "Set more than a decade after the events of the first film, Avatar: The Way of Water begins to tell the story of the Sully family, the trouble that follows them, the lengths they go to keep each other safe, the battles they fight to stay alive, and the tragedies they endure.",
      cast: ["Sam Worthington", "Zoe Saldana", "Sigourney Weaver", "Stephen Lang", "Kate Winslet"],
      director: "James Cameron",
      language: "English",
      category: "coming-soon",
      releaseDate: new Date('2022-12-16'),
      tmdbId: 76600
    },
    {
      title: "Black Panther: Wakanda Forever",
      genre: "Action • Adventure • Drama",
      duration: 161,
      rating: 7.3,
      year: "2022",
      image: "https://image.tmdb.org/t/p/w500/sv1xJUazXeYqALzczSZ3O6nkH75.jpg",
      synopsis: "Queen Ramonda, Shuri, M'Baku, Okoye and the Dora Milaje fight to protect their nation from intervening world powers in the wake of King T'Challa's death.",
      cast: ["Letitia Wright", "Angela Bassett", "Tenoch Huerta", "Danai Gurira", "Lupita Nyong'o"],
      director: "Ryan Coogler",
      language: "English",
      category: "action",
      releaseDate: new Date('2022-11-11'),
      tmdbId: 505642
    },
    {
      title: "The Batman",
      genre: "Action • Crime • Drama",
      duration: 176,
      rating: 7.8,
      year: "2022",
      image: "https://image.tmdb.org/t/p/w500/b0PlSFdDwbyK0cf5RxwDpaOJQvQ.jpg",
      synopsis: "In his second year of fighting crime, Batman uncovers corruption in Gotham City that connects to his own family while facing a serial killer known as the Riddler.",
      cast: ["Robert Pattinson", "Zoë Kravitz", "Paul Dano", "Jeffrey Wright", "Colin Farrell"],
      director: "Matt Reeves",
      language: "English",
      category: "top-rated",
      releaseDate: new Date('2022-03-04'),
      tmdbId: 414906
    },
    {
      title: "Doctor Strange in the Multiverse of Madness",
      genre: "Action • Adventure • Fantasy",
      duration: 126,
      rating: 7.0,
      year: "2022",
      image: "https://image.tmdb.org/t/p/w500/9Gtg2DzBhmYamXBS1hKAhiwbBKS.jpg",
      synopsis: "Dr. Stephen Strange casts a forbidden spell that opens the doorway to the multiverse, including alternate versions of himself, whose threat to humanity is too great for the combined forces of Strange, Wong, and Wanda Maximoff.",
      cast: ["Benedict Cumberbatch", "Elizabeth Olsen", "Chiwetel Ejiofor", "Benedict Wong", "Xochitl Gomez"],
      director: "Sam Raimi",
      language: "English",
      category: "action",
      releaseDate: new Date('2022-05-06'),
      tmdbId: 453395
    },
    {
      title: "Dune",
      genre: "Action • Adventure • Drama",
      duration: 155,
      rating: 8.0,
      year: "2021",
      image: "https://image.tmdb.org/t/p/w500/d5NXSklXo0qyIYkgV94XAgMIckC.jpg",
      synopsis: "Paul Atreides, a brilliant and gifted young man born into a great destiny beyond his understanding, must travel to the most dangerous planet in the universe to ensure the future of his family and his people.",
      cast: ["Timothée Chalamet", "Rebecca Ferguson", "Oscar Isaac", "Josh Brolin", "Stellan Skarsgård"],
      director: "Denis Villeneuve",
      language: "English",
      category: "top-rated",
      releaseDate: new Date('2021-10-22'),
      tmdbId: 438631
    },
    {
      title: "No Time to Die",
      genre: "Action • Adventure • Thriller",
      duration: 163,
      rating: 7.3,
      year: "2021",
      image: "https://image.tmdb.org/t/p/w500/iUgygt3fscRoKWCV1d0C7FbM9TP.jpg",
      synopsis: "Bond has left active service and is enjoying a tranquil life in Jamaica. His peace is short-lived when his old friend Felix Leiter from the CIA turns up asking for help, leading Bond onto the trail of a mysterious villain armed with dangerous new technology.",
      cast: ["Daniel Craig", "Rami Malek", "Léa Seydoux", "Lashana Lynch", "Ben Whishaw"],
      director: "Cary Joji Fukunaga",
      language: "English",
      category: "action",
      releaseDate: new Date('2021-10-08'),
      tmdbId: 370172
    },
    {
      title: "Fast X",
      genre: "Action • Crime • Thriller",
      duration: 141,
      rating: 5.8,
      year: "2023",
      image: "https://image.tmdb.org/t/p/w500/fiVW06jE7z9YnO4trhaMEdclSiC.jpg",
      synopsis: "Over many missions and against impossible odds, Dom Toretto and his family have outsmarted, out-nerved and outdriven every foe in their path. Now, they confront the most lethal opponent they've ever faced: A terrifying threat emerging from the shadows of the past who's fueled by blood revenge, and who is determined to shatter this family and destroy everything—and everyone—that Dom loves, forever.",
      cast: ["Vin Diesel", "Michelle Rodriguez", "Tyrese Gibson", "Ludacris", "John Cena"],
      director: "Louis Leterrier",
      language: "English",
      category: "coming-soon",
      releaseDate: new Date('2023-05-19'),
      tmdbId: 385687
    },
    {
      title: "Guardians of the Galaxy Vol. 3",
      genre: "Action • Adventure • Comedy",
      duration: 150,
      rating: 8.0,
      year: "2023",
      image: "https://image.tmdb.org/t/p/w500/r2J02Z2OpNTctfOSN1Ydgii51I3.jpg",
      synopsis: "Peter Quill, still reeling from the loss of Gamora, must rally his team around him to defend the universe along with protecting one of their own. A mission that, if not completed successfully, could quite possibly lead to the end of the Guardians as we know them.",
      cast: ["Chris Pratt", "Zoe Saldana", "Dave Bautista", "Karen Gillan", "Pom Klementieff"],
      director: "James Gunn",
      language: "English",
      category: "top-rated",
      releaseDate: new Date('2023-05-05'),
      tmdbId: 447365
    }
  ];
};

// Get top rated movies
export const getTopRatedMovies = () => {
  const movies = getCurrentMovies();
  return movies.filter(movie => movie.category === 'top-rated' || movie.rating >= 8.0);
};

// Get currently showing movies (action category)
export const getCurrentlyShowingMovies = () => {
  const movies = getCurrentMovies();
  return movies.filter(movie => movie.category === 'action' || movie.category === 'coming-soon');
};

// Get movie by category
export const getMoviesByCategory = (category) => {
  const movies = getCurrentMovies();
  if (category === 'all') return movies;
  return movies.filter(movie => movie.category === category);
};