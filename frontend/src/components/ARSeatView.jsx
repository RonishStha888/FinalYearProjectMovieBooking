import { useState, useEffect, useRef } from "react";
import "./ARSeatView.css";

export default function ARSeatView({ 
  seatLayout, 
  selectedSeats, 
  bookedSeats, 
  onSeatClick, 
  onClose,
  selectedHall 
}) {
  const [isARActive, setIsARActive] = useState(false);
  const [cameraPermission, setCameraPermission] = useState(null);
  const [viewMode, setViewMode] = useState('ar'); // Only AR mode now
  const [zoomLevel, setZoomLevel] = useState(1); // Zoom functionality
  const [isTrailerPlaying, setIsTrailerPlaying] = useState(false);
  const [trailerVideoId, setTrailerVideoId] = useState('TcMBFSGVi1c'); // Avengers Endgame trailer
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [deviceOrientation, setDeviceOrientation] = useState({ alpha: 0, beta: 0, gamma: 0 });
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [smoothMousePosition, setSmoothMousePosition] = useState({ x: 0, y: 0 });
  const [isMouseActive, setIsMouseActive] = useState(false);
  const mouseVelocity = useRef({ x: 0, y: 0 });
  const animationFrameRef = useRef(null);
  const lastMouseTime = useRef(Date.now());

  useEffect(() => {
    // Request device orientation permission for iOS
    if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
      DeviceOrientationEvent.requestPermission()
        .then(response => {
          if (response === 'granted') {
            window.addEventListener('deviceorientation', handleOrientation);
          }
        })
        .catch(console.error);
    } else {
      // For Android and other devices
      window.addEventListener('deviceorientation', handleOrientation);
    }

    // Enhanced mouse movement for desktop AR simulation
    const handleMouseMove = (event) => {
      const rect = event.currentTarget.getBoundingClientRect();
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      // Calculate normalized position from center (-1 to 1)
      const rawX = ((event.clientX - rect.left - centerX) / centerX);
      const rawY = ((event.clientY - rect.top - centerY) / centerY);
      
      // Apply smooth curve for more natural movement
      const smoothX = Math.sign(rawX) * Math.pow(Math.abs(rawX), 0.8);
      const smoothY = Math.sign(rawY) * Math.pow(Math.abs(rawY), 0.8);
      
      // Clamp values to prevent extreme movements
      const clampedX = Math.max(-1, Math.min(1, smoothX));
      const clampedY = Math.max(-1, Math.min(1, smoothY));
      
      setMousePosition({ x: clampedX, y: clampedY });
      setIsMouseActive(true);
      
      // Calculate velocity for momentum
      const currentTime = Date.now();
      const deltaTime = currentTime - lastMouseTime.current;
      if (deltaTime > 0) {
        mouseVelocity.current = {
          x: (clampedX - smoothMousePosition.x) / deltaTime * 1000,
          y: (clampedY - smoothMousePosition.y) / deltaTime * 1000
        };
      }
      lastMouseTime.current = currentTime;
    };

    const handleMouseLeave = () => {
      setIsMouseActive(false);
    };

    const handleMouseEnter = () => {
      setIsMouseActive(true);
    };

    // Scroll to zoom functionality
    const handleWheel = (event) => {
      event.preventDefault();
      const zoomDelta = event.deltaY > 0 ? -0.1 : 0.1;
      setZoomLevel(prevZoom => {
        const newZoom = prevZoom + zoomDelta;
        return Math.max(0.5, Math.min(3, newZoom)); // Limit zoom between 0.5x and 3x
      });
    };

    const arViewport = document.querySelector('.ar-viewport');
    if (arViewport) {
      arViewport.addEventListener('mousemove', handleMouseMove);
      arViewport.addEventListener('mouseleave', handleMouseLeave);
      arViewport.addEventListener('mouseenter', handleMouseEnter);
      arViewport.addEventListener('wheel', handleWheel, { passive: false });
    }

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
      if (arViewport) {
        arViewport.removeEventListener('mousemove', handleMouseMove);
        arViewport.removeEventListener('mouseleave', handleMouseLeave);
        arViewport.removeEventListener('mouseenter', handleMouseEnter);
        arViewport.removeEventListener('wheel', handleWheel);
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [smoothMousePosition]);

  // Smooth interpolation animation loop
  useEffect(() => {
    const animate = () => {
      setSmoothMousePosition(prev => {
        const lerpFactor = isMouseActive ? 0.15 : 0.05; // Faster when mouse active
        const dampingFactor = 0.95; // Damping for momentum
        
        let targetX = mousePosition.x;
        let targetY = mousePosition.y;
        
        // Add momentum when mouse is not active
        if (!isMouseActive) {
          targetX = prev.x + mouseVelocity.current.x * 0.001;
          targetY = prev.y + mouseVelocity.current.y * 0.001;
          
          // Apply damping to velocity
          mouseVelocity.current.x *= dampingFactor;
          mouseVelocity.current.y *= dampingFactor;
        }
        
        // Smooth interpolation
        const newX = prev.x + (targetX - prev.x) * lerpFactor;
        const newY = prev.y + (targetY - prev.y) * lerpFactor;
        
        // Clamp final values
        return {
          x: Math.max(-1, Math.min(1, newX)),
          y: Math.max(-1, Math.min(1, newY))
        };
      });
      
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    
    animationFrameRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [mousePosition, isMouseActive]);

  const handleOrientation = (event) => {
    setDeviceOrientation({
      alpha: event.alpha || 0,
      beta: event.beta || 0,
      gamma: event.gamma || 0
    });
  };

  const startARView = async () => {
    // Simulate AR experience without camera for laptops/desktops without camera
    try {
      // Check if camera is available
      const devices = await navigator.mediaDevices.enumerateDevices();
      const hasCamera = devices.some(device => device.kind === 'videoinput');
      
      if (hasCamera && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        // Try to access camera if available
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { 
              facingMode: 'environment',
              width: { ideal: 1280 },
              height: { ideal: 720 }
            }
          });
          
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play();
            setIsARActive(true);
            setCameraPermission(true);
            return;
          }
        } catch (cameraError) {
          console.log('Camera access failed, using simulated AR:', cameraError);
        }
      }
      
      // Fallback to simulated AR experience (no camera required)
      setIsARActive(false); // Don't show camera feed
      setCameraPermission(true); // Set to true to avoid error messages
      
    } catch (error) {
      console.log('Using simulated AR experience:', error);
      // Always fallback to simulated AR
      setIsARActive(false);
      setCameraPermission(true);
    }
  };

  const stopARView = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsARActive(false);
  };

  const getSeatClass = (seatId) => {
    let classes = ['ar-seat'];
    
    if (seatLayout.disabledSeats.includes(seatId)) {
      classes.push('disabled');
    } else if (bookedSeats.includes(seatId)) {
      classes.push('booked');
    } else if (selectedSeats.includes(seatId)) {
      classes.push('selected');
    } else {
      classes.push('available');
    }

    const row = seatId.charAt(0);
    if (seatLayout.premiumRows.includes(row)) {
      classes.push('premium');
    }

    if (seatLayout.isRecliners) {
      classes.push('recliner');
    }

    return classes.join(' ');
  };

  const renderCinemaHall3D = () => {
    // Cinema-goer's POV: Looking towards the screen from a seat with enhanced mouse control and zoom
    const mouseInfluenceX = smoothMousePosition.x * 25; // Increased sensitivity
    const mouseInfluenceY = smoothMousePosition.y * 15; // Increased sensitivity
    const orientationX = deviceOrientation.beta * 0.2;
    const orientationY = deviceOrientation.gamma * 0.3;
    
    // Add subtle rotation limits for realism
    const maxRotationX = 20;
    const maxRotationY = 30;
    
    const finalRotationX = Math.max(-maxRotationX, Math.min(maxRotationX, -5 + orientationX + mouseInfluenceY));
    const finalRotationY = Math.max(-maxRotationY, Math.min(maxRotationY, orientationY + mouseInfluenceX));
    
    const perspective = `
      perspective(1400px) 
      rotateX(${finalRotationX}deg) 
      rotateY(${finalRotationY}deg) 
      translateZ(0px)
      scale(${zoomLevel})
    `;

    return (
      <div className="cinema-hall-3d" style={{ transform: perspective }}>
        {renderCinemaGoerPOV()}
      </div>
    );
  };

  // Cinema-goer's perspective: View from a seat looking towards screen
  const renderCinemaGoerPOV = () => {
    // Calculate parallax effects based on mouse position
    const parallaxX = smoothMousePosition.x * 10;
    const parallaxY = smoothMousePosition.y * 5;
    
    return (
      <>
        {/* Large Cinema Screen (what you see when sitting) */}
        <div 
          className="cinema-screen-pov"
          style={{
            transform: `translateX(calc(-50% + ${parallaxX * 0.5}px)) translateY(${parallaxY * 0.3}px)`
          }}
        >
          <div className="screen-main">
            <div className="screen-content">
              {isTrailerPlaying ? (
                <div className="trailer-container">
                  <iframe
                    className="youtube-trailer"
                    src={`https://www.youtube.com/embed/${trailerVideoId}?autoplay=1&mute=0&controls=1&rel=0&modestbranding=1`}
                    title="Movie Trailer"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                  <button 
                    className="close-trailer-btn"
                    onClick={() => setIsTrailerPlaying(false)}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2"/>
                      <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                  </button>
                </div>
              ) : (
                <div className="movie-preview">
                  <div className="preview-text">NOW SHOWING</div>
                  <div className="movie-title">{selectedHall?.name || 'CINEMA HALL'}</div>
                  <button 
                    className="play-trailer-btn"
                    onClick={() => setIsTrailerPlaying(true)}
                  >
                    <svg width="60" height="60" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                      <polygon points="10,8 16,12 10,16" fill="currentColor"/>
                    </svg>
                    <span>Watch Trailer</span>
                  </button>
                  <div className="preview-effects">
                    <div className="light-ray"></div>
                    <div className="light-ray"></div>
                    <div className="light-ray"></div>
                  </div>
                </div>
              )}
            </div>
            <div className="screen-frame"></div>
          </div>
          <div className="screen-speakers">
            <div 
              className="speaker left-speaker"
              style={{
                transform: `translateX(${parallaxX * 0.8}px) translateY(${parallaxY * 0.4}px)`
              }}
            ></div>
            <div 
              className="speaker right-speaker"
              style={{
                transform: `translateX(${parallaxX * -0.8}px) translateY(${parallaxY * 0.4}px)`
              }}
            ></div>
          </div>
        </div>

        {/* Cinema Environment from seat perspective */}
        <div className="cinema-environment-pov">
          {/* Ceiling with lights */}
          <div 
            className="ceiling-pov"
            style={{
              transform: `rotateX(90deg) translateX(${parallaxX * 2}px) translateY(${parallaxY * 1}px)`
            }}
          >
            <div className="ceiling-pattern"></div>
            <div className="ceiling-lights-pov">
              <div className="ceiling-light-strip"></div>
              <div className="ceiling-light-strip"></div>
              <div className="ceiling-light-strip"></div>
            </div>
          </div>

          {/* Side walls */}
          <div className="side-walls-pov">
            <div 
              className="wall-pov left-wall-pov"
              style={{
                transform: `rotateY(45deg) translateX(${parallaxX * 1.5}px) translateY(${parallaxY * 0.8}px)`
              }}
            >
              <div className="wall-panels"></div>
              <div className="emergency-exit">EXIT</div>
            </div>
            <div 
              className="wall-pov right-wall-pov"
              style={{
                transform: `rotateY(-45deg) translateX(${parallaxX * -1.5}px) translateY(${parallaxY * 0.8}px)`
              }}
            >
              <div className="wall-panels"></div>
              <div className="emergency-exit">EXIT</div>
            </div>
          </div>

          {/* Floor from seat perspective */}
          <div 
            className="floor-pov"
            style={{
              transform: `rotateX(90deg) translateX(${parallaxX * 3}px) translateY(${parallaxY * 2}px)`
            }}
          >
            <div className="floor-carpet"></div>
            <div className="aisle-lights-pov">
              <div className="aisle-light"></div>
              <div className="aisle-light"></div>
              <div className="aisle-light"></div>
              <div className="aisle-light"></div>
            </div>
          </div>

          {/* Seats in front (what you see from your seat) */}
          <div 
            className="seats-in-front"
            style={{
              transform: `translateX(calc(-50% + ${parallaxX * 1.2}px)) translateY(${parallaxY * 0.6}px)`
            }}
          >
            {[1, 2, 3, 4, 5].map((row) => (
              <div key={row} className="front-seat-row" style={{
                transform: `translateZ(${-50 - (row * 80)}px) translateY(${row * 8}px)`
              }}>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((seat) => (
                  <div key={seat} className="front-seat">
                    <div className="front-seat-back"></div>
                    <div className="front-seat-headrest"></div>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Your seat selection overlay */}
          <div className="seat-selection-overlay">
            <div className="selected-seats-info">
              <h3>Your Selected Seats</h3>
              <div className="seats-list">
                {selectedSeats.map(seat => (
                  <div key={seat} className="selected-seat-badge">
                    <span className="seat-id">{seat}</span>
                    <span className="seat-type">
                      {seatLayout.premiumRows.includes(seat.charAt(0)) ? 'Premium' : 'Standard'}
                    </span>
                  </div>
                ))}
              </div>
              {selectedSeats.length === 0 && (
                <p className="no-seats">No seats selected</p>
              )}
            </div>
          </div>
        </div>
      </>
    );
  };



  return (
    <div className="ar-seat-view">
      {/* AR Controls */}
      <div className="ar-controls">
        <button className="close-ar-btn" onClick={onClose}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2"/>
            <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2"/>
          </svg>
        </button>

        <div className="view-mode-controls">
          <div className="zoom-controls">
            <button 
              className="zoom-btn"
              onClick={() => setZoomLevel(prev => Math.max(0.5, prev - 0.2))}
              disabled={zoomLevel <= 0.5}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
                <path d="M8 11h6" stroke="currentColor" strokeWidth="2"/>
              </svg>
              Zoom Out
            </button>
            
            <div className="zoom-indicator">
              <span>{Math.round(zoomLevel * 100)}%</span>
            </div>
            
            <button 
              className="zoom-btn"
              onClick={() => setZoomLevel(prev => Math.min(3, prev + 0.2))}
              disabled={zoomLevel >= 3}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
                <path d="M8 11h6m-3-3v6" stroke="currentColor" strokeWidth="2"/>
              </svg>
              Zoom In
            </button>
          </div>
          
          <div className="trailer-controls">
            <select 
              className="trailer-selector"
              value={trailerVideoId}
              onChange={(e) => setTrailerVideoId(e.target.value)}
            >
              <option value="TcMBFSGVi1c">Avengers: Endgame</option>
              <option value="hA6hldpSTF8">Spider-Man: No Way Home</option>
              <option value="6ZfuNTqbHE8">Interstellar</option>
              <option value="YQHsXMglC9A">Inception</option>
              <option value="dQw4w9WgXcQ">The Dark Knight</option>
              <option value="hFZFjoX2cGg">Joker</option>
            </select>
            
            <button 
              className="trailer-btn"
              onClick={() => setIsTrailerPlaying(!isTrailerPlaying)}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                {isTrailerPlaying ? (
                  <rect x="6" y="4" width="4" height="16" fill="currentColor"/>
                ) : (
                  <polygon points="5,3 19,12 5,21" fill="currentColor"/>
                )}
              </svg>
              {isTrailerPlaying ? 'Stop' : 'Play'} Trailer
            </button>
          </div>
        </div>

        <div className="ar-info">
          <div className="hall-info">
            <h3>{selectedHall?.name || 'Cinema Hall'}</h3>
            <p>{selectedHall?.type || 'Standard'} • {seatLayout.rows.length} rows</p>
          </div>
          <div className="selection-info">
            <span>Selected: {selectedSeats.length} seats</span>
          </div>
        </div>
      </div>

      {/* AR/3D Viewport */}
      <div className="ar-viewport">
        {/* Simulated AR Background (no camera required) */}
        <div className="simulated-ar-background">
          <div className="ar-environment">
            <div className="ar-grid"></div>
            <div className="ar-particles">
              <div className="particle"></div>
              <div className="particle"></div>
              <div className="particle"></div>
              <div className="particle"></div>
              <div className="particle"></div>
            </div>
            <div className="ar-horizon"></div>
          </div>
        </div>
        
        {/* Mouse interaction indicator */}
        <div className="mouse-interaction-overlay">
          <div 
            className={`mouse-indicator ${isMouseActive ? 'active' : ''}`}
            style={{
              transform: `translate(${smoothMousePosition.x * 50}px, ${smoothMousePosition.y * 30}px)`
            }}
          >
            <div className="indicator-dot"></div>
            <div className="indicator-rings">
              <div className="ring ring-1"></div>
              <div className="ring ring-2"></div>
              <div className="ring ring-3"></div>
            </div>
          </div>
          
          {/* Movement guide */}
          <div className="movement-guide">
            <div className="guide-text">Move mouse to look around • Scroll to zoom • Play trailers</div>
            <div className="guide-arrows">
              <div className="arrow arrow-up">↑</div>
              <div className="arrow arrow-down">↓</div>
              <div className="arrow arrow-left">←</div>
              <div className="arrow arrow-right">→</div>
            </div>
          </div>
        </div>
        
        <div className="ar-overlay">
          {renderCinemaHall3D()}
        </div>

        {/* Enhanced AR Instructions */}
        <div className="ar-instructions">
          <div className="instruction-card">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M15 10l4.553-2.276A1 1 0 0 1 21 8.618v6.764a1 1 0 0 1-1.447.894L15 14M5 18h8a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2z" stroke="currentColor" strokeWidth="2"/>
            </svg>
            <p>Cinema-Goer's AR View</p>
            <small>Move mouse to look around • Scroll to zoom • Click screen to play trailer</small>
          </div>
        </div>

        {/* Remove camera error since we're using simulated AR */}
      </div>

      {/* Seat Legend for AR */}
      <div className="ar-legend">
        <div className="legend-item">
          <div className="ar-seat available mini"></div>
          <span>Available</span>
        </div>
        <div className="legend-item">
          <div className="ar-seat selected mini"></div>
          <span>Selected</span>
        </div>
        <div className="legend-item">
          <div className="ar-seat booked mini"></div>
          <span>Booked</span>
        </div>
        <div className="legend-item">
          <div className="ar-seat premium available mini"></div>
          <span>Premium</span>
        </div>
      </div>
    </div>
  );
}