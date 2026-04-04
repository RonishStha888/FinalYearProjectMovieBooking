import { useEffect } from 'react';
import './FBPromptModal.css';

export default function FBPromptModal({ isOpen, onYes, onNo, ticketCount }) {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);
  
  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onNo();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onNo]);
  
  if (!isOpen) return null;
  
  return (
    <div className="fb-prompt-overlay" onClick={onNo}>
      <div className="fb-prompt-modal" onClick={(e) => e.stopPropagation()}>
        {/* Icon */}
        <div className="fb-prompt-icon">
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="#FFD700"/>
          </svg>
          <div className="popcorn-emoji">🍿</div>
        </div>
        
        {/* Title */}
        <h2 className="fb-prompt-title">Enhance Your Experience!</h2>
        
        {/* Message */}
        <p className="fb-prompt-message">
          Would you like to add Food & Beverages to your booking?
        </p>
        
        {/* Popular items preview */}
        <div className="fb-prompt-preview">
          <div className="preview-item">
            <span className="preview-emoji">🍿</span>
            <span className="preview-text">Popcorn</span>
          </div>
          <div className="preview-item">
            <span className="preview-emoji">🥤</span>
            <span className="preview-text">Drinks</span>
          </div>
          <div className="preview-item">
            <span className="preview-emoji">🍕</span>
            <span className="preview-text">Snacks</span>
          </div>
          <div className="preview-item">
            <span className="preview-emoji">🎁</span>
            <span className="preview-text">Combos</span>
          </div>
        </div>
        
        {/* Benefits */}
        <div className="fb-prompt-benefits">
          <div className="benefit-item">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M20 6L9 17L4 12" stroke="#4CAF50" strokeWidth="2"/>
            </svg>
            <span>Special combo discounts available</span>
          </div>
          <div className="benefit-item">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M20 6L9 17L4 12" stroke="#4CAF50" strokeWidth="2"/>
            </svg>
            <span>Skip the queue at the counter</span>
          </div>
          <div className="benefit-item">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M20 6L9 17L4 12" stroke="#4CAF50" strokeWidth="2"/>
            </svg>
            <span>Fresh items ready when you arrive</span>
          </div>
        </div>
        
        {/* Buttons */}
        <div className="fb-prompt-buttons">
          <button className="fb-prompt-btn fb-prompt-btn-yes" onClick={onYes}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor"/>
            </svg>
            Yes, Show Menu
          </button>
          <button className="fb-prompt-btn fb-prompt-btn-no" onClick={onNo}>
            No, Continue to Payment
          </button>
        </div>
        
        {/* Ticket count hint */}
        {ticketCount > 1 && (
          <p className="fb-prompt-hint">
            💡 We have special {ticketCount}-person combos with great savings!
          </p>
        )}
      </div>
    </div>
  );
}
