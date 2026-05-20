import { useState, useEffect } from 'react';
import './FloatingActionButtons.css';

const FloatingActionButtons = ({ onScrollToTop, onQuickBook, onHelp, onFeedback, currentPage }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Show scroll to top button after scrolling 300px
      setShowScrollTop(currentScrollY > 300);
      
      // Hide FABs when scrolling down, show when scrolling up
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
        setIsExpanded(false);
      } else {
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleAction = (action) => {
    setIsExpanded(false);
    action();
  };

  // Don't show on certain pages
  const hiddenPages = ['payment', 'seat-selection', 'ticket'];
  if (hiddenPages.includes(currentPage)) {
    return null;
  }

  return (
    <div className={`fab-container ${isVisible ? 'visible' : 'hidden'}`}>
      {/* Scroll to Top FAB */}
      {showScrollTop && (
        <button
          className="fab fab-scroll-top"
          onClick={onScrollToTop}
          aria-label="Scroll to top"
          title="Back to Top"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 19V5M5 12L12 5L19 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      )}

      {/* Secondary FABs */}
      <div className={`fab-menu ${isExpanded ? 'expanded' : ''}`}>
        {/* Quick Book FAB */}
        <button
          className="fab fab-secondary fab-book"
          onClick={() => handleAction(onQuickBook)}
          aria-label="Quick book tickets"
          title="Quick Book"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
            <line x1="8" y1="21" x2="16" y2="21" stroke="currentColor" strokeWidth="2"/>
            <line x1="12" y1="17" x2="12" y2="21" stroke="currentColor" strokeWidth="2"/>
          </svg>
          <span className="fab-label">Quick Book</span>
        </button>

        {/* Help FAB */}
        <button
          className="fab fab-secondary fab-help"
          onClick={() => handleAction(onHelp)}
          aria-label="Get help"
          title="Help & Support"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <circle cx="12" cy="17" r="0.5" fill="currentColor" stroke="currentColor"/>
          </svg>
          <span className="fab-label">Help</span>
        </button>

        {/* Feedback FAB */}
        <button
          className="fab fab-secondary fab-feedback"
          onClick={() => handleAction(onFeedback)}
          aria-label="Send feedback"
          title="Feedback"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="2"/>
            <path d="M8 10h8M8 14h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <span className="fab-label">Feedback</span>
        </button>
      </div>

      {/* Main FAB */}
      <button
        className={`fab fab-main ${isExpanded ? 'expanded' : ''}`}
        onClick={toggleExpand}
        aria-label={isExpanded ? 'Close menu' : 'Open quick actions'}
        title="Quick Actions"
      >
        <svg 
          className="fab-icon fab-icon-plus" 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none"
        >
          <line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        <svg 
          className="fab-icon fab-icon-close" 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none"
        >
          <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </button>

      {/* Backdrop */}
      {isExpanded && (
        <div 
          className="fab-backdrop" 
          onClick={() => setIsExpanded(false)}
          aria-hidden="true"
        />
      )}
    </div>
  );
};

export default FloatingActionButtons;
