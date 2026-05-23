#RTX Cinema - Professional Movie Booking System

A comprehensive cinema booking system built with React.js and Node.js, featuring realistic seat selection, real movie data integration, and professional cinema-grade UI design.

## Features

### Professional Seat Selection System
- **Realistic Cinema Layouts**: Based on actual QFX Cinema, FCube Cinema, and Big Movies configurations
- **Interactive Seat Map**: Click to select/deselect seats with visual feedback
- **Premium Seating**: Gold borders for premium rows with +Rs. 100 surcharge
- **Recliner Seats**: Special styling for luxury halls
- **Dynamic Pricing**: Weekend pricing, premium surcharges, convenience fees
- **Professional UI**: Cinema-grade design with glassmorphism effects

### Real Movie Integration
- **10 Current Movies**: Spider-Man, Top Gun, Avatar, Black Panther, Batman, etc.
- **Real TMDB Posters**: High-quality movie posters from The Movie Database
- **Movie Categories**: Top Rated, Action, Coming Soon
- **Complete Movie Data**: Cast, director, synopsis, ratings, duration

### Realistic Cinema Data
- **QFX Cinema Jai Nepal**: Regular Hall (156 seats) + Gold Class (48 recliners)
- **FCube Cinema Labim Mall**: Standard Hall (120 seats) + Premium (60 recliners)
- **Big Movies Civil Mall**: Main Hall (140 seats)
- **2,800 Showtimes**: 14 days of showtimes across all movies and halls
- **Dynamic Pricing**: Weekend surcharges, hall-specific pricing

### User Authentication
- **Email Verification**: Gmail SMTP integration with verification codes
- **Secure Login**: Bcrypt password hashing
- **Multiple Auth Methods**: Email and username login

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/RonishStha888/FinalYearProjectMovieBooking.git
   cd FinalYearProjectMovieBooking
   ```

2. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Environment Setup**
   
   Create `.env` file in the backend directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/rtx_cinema
   JWT_SECRET=your_jwt_secret_key
   EMAIL_USER=your_gmail@gmail.com
   EMAIL_PASS=your_gmail_app_password
   ```

5. **Seed the Database**
   ```bash
   cd backend
   node seedData.js
   ```

6. **Start the Application**
   
   **Backend** (Terminal 1):
   ```bash
   cd backend
   npm start
   ```
   
   **Frontend** (Terminal 2):
   ```bash
   cd frontend
   npm run dev
   ```

7. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:5000

## Test Login Credentials

- **Username**: `testuser` | **Password**: `password123`
- **Username**: `admin` | **Password**: `password123`
- **Username**: `john_doe` | **Password**: `password123`

## Complete Booking Flow

```
Login → Browse Movies → Select Date/Time/Cinema → Choose Seats → Confirm Booking
```

### Step-by-Step Usage:

1. **Login**: Use test credentials above
2. **Browse Movies**: See 10 real movies with TMDB posters
3. **Select Movie**: Click any movie to start booking
4. **Choose Date**: Pick from next 14 days
5. **Select Cinema**: QFX, FCube, or Big Movies
6. **Pick Showtime**: Choose from 4 daily shows (10:30, 13:45, 17:00, 20:15)
7. **Select Seats**: Experience professional seat selection with realistic layouts
8. **Confirm Booking**: Complete booking with total pricing

## Technical Architecture

### Frontend (React.js)
- **React 18** with Vite
- **Modern CSS** with Glassmorphism effects
- **Responsive Design** optimized for 1920x1080
- **Component-based Architecture**
- **Real-time State Management**

### Backend (Node.js)
- **Express.js** REST API
- **MongoDB** with Mongoose ODM
- **JWT Authentication**
- **Email Integration** with Nodemailer
- **Bcrypt** password hashing

### Database Schema
- **Users**: Authentication and profile data
- **Movies**: Real movie data with TMDB integration
- **Cinemas**: Realistic cinema information
- **Halls**: Different hall types and configurations
- **Showtimes**: 2,800+ showtimes across 14 days
- **Bookings**: Complete booking records

##  Cinema Hall Configurations

### QFX Cinema Jai Nepal (Chabahil)
- **Regular Hall**: 12 rows (A-L), 156 seats, Premium rows F-H
- **Gold Class**: 6 rows (A-F), 48 recliner seats, Premium rows C-E

### FCube Cinema (Labim Mall)
- **Standard Hall**: 10 rows (A-J), 120 seats, Premium rows E-G
- **Premium Hall**: 6 rows (A-F), 60 recliner seats, Premium rows C-E

### Big Movies (Civil Mall)
- **Main Hall**: 14 rows (A-N), 140 seats, Premium rows G-J

##  Pricing Structure

- **Base Prices**: Rs. 380-700 depending on hall type
- **Weekend Surcharge**: Automatic weekend pricing
- **Premium Seats**: +Rs. 100 for best viewing rows
- **Recliner Surcharge**: Luxury seating premium
- **Convenience Fee**: Rs. 25 (industry standard)

## UI/UX Features

- **Cinema Red Theme**: Professional #D84040 color scheme
- **Glassmorphism Effects**: Modern backdrop blur and transparency
- **Smooth Animations**: Hardware-accelerated transitions
- **Hover Effects**: Interactive seat selection feedback
- **Responsive Design**: Perfect on all devices
- **Professional Typography**: Inter font family

##  Responsive Design

- **Desktop (1920x1080)**: Full cinema experience
- **Laptop (1200px)**: Optimized seat sizing
- **Tablet (968px)**: Stacked layout with touch-friendly seats
- **Mobile (640px)**: Compact seat map with scrolling

##  API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/verify-email` - Email verification

### Movies
- `GET /api/movies` - Get all movies
- `GET /api/movies/top-rated` - Get top rated movies
- `GET /api/movies/now-showing` - Get currently showing movies
- `GET /api/movies/:id/showtimes` - Get movie showtimes

### Cinemas
- `GET /api/cinemas` - Get all cinemas
- `GET /api/cinemas/:id` - Get cinema details

##  Movie Data

Current movies with real TMDB posters:
- Spider-Man: No Way Home (8.2/10)
- Top Gun: Maverick (8.3/10)
- Avatar: The Way of Water (7.6/10)
- Black Panther: Wakanda Forever (7.3/10)
- The Batman (7.8/10)
- Doctor Strange in the Multiverse of Madness (7.0/10)
- Dune (8.0/10)
- No Time to Die (7.3/10)
- Fast X (5.8/10)
- Guardians of the Galaxy Vol. 3 (8.0/10)

##  Professional Features

- **Industry-Standard Layouts**: Matches real cinema configurations
- **Realistic Pricing**: Based on actual Nepali cinema pricing
- **Occupancy Simulation**: 15% random booking patterns
- **Premium Zones**: Industry-standard premium row placement
- **Accessibility**: Disabled seat handling
- **Performance Optimized**: Efficient rendering and state management

##  System Statistics

- **3 Cinemas** with realistic data
- **5 Different Halls** with varying capacities
- **10 Current Movies** with real posters
- **2,800 Showtimes** across 14 days
- **4 Daily Shows** per hall (10:30, 13:45, 17:00, 20:15)
- **Professional UI** optimized for cinema booking

##  Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

##  License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

##  Author

**Ronish Shrestha**
- GitHub: [@RonishStha888](https://github.com/RonishStha888)
- Project: Final Year Project - Movie Booking System

##  Acknowledgments

- **TMDB (The Movie Database)** for movie posters and data
- **QFX Cinema, FCube Cinema, Big Movies** for realistic cinema layouts
- **React.js & Node.js** communities for excellent documentation
- **MongoDB** for reliable database solutions

---

##  Experience Professional Cinema Booking!

**Open http://localhost:3000, login with `testuser`/`password123`, and experience the complete cinema booking system with realistic seat selection!** 🎬✨
