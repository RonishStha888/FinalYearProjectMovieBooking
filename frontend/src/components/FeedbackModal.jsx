import { useState } from 'react';
import './FeedbackModal.css';

const FeedbackModal = ({ isOpen, onClose }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [category, setCategory] = useState('');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const categories = [
    { value: 'booking', label: 'Booking Experience', icon: '🎫' },
    { value: 'website', label: 'Website Performance', icon: '💻' },
    { value: 'cinema', label: 'Cinema Facilities', icon: '🎬' },
    { value: 'customer-service', label: 'Customer Service', icon: '👥' },
    { value: 'suggestion', label: 'Suggestion', icon: '💡' },
    { value: 'other', label: 'Other', icon: '📝' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!rating || !category || !message.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      
      // Reset form after 2 seconds and close
      setTimeout(() => {
        handleClose();
      }, 2000);
    }, 1500);
  };

  const handleClose = () => {
    setRating(0);
    setHoverRating(0);
    setCategory('');
    setMessage('');
    setEmail('');
    setIsSubmitted(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="feedback-modal-overlay" onClick={handleClose}>
      <div className="feedback-modal" onClick={(e) => e.stopPropagation()}>
        <button className="feedback-close-btn" onClick={handleClose} aria-label="Close feedback">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2"/>
            <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2"/>
          </svg>
        </button>

        {!isSubmitted ? (
          <>
            <div className="feedback-header">
              <div className="feedback-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="2"/>
                  <path d="M8 10h8M8 14h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <h2>We Value Your Feedback</h2>
              <p>Help us improve your RTX Cinema experience</p>
            </div>

            <form className="feedback-form" onSubmit={handleSubmit}>
              {/* Rating */}
              <div className="form-group">
                <label className="form-label">
                  How would you rate your experience? <span className="required">*</span>
                </label>
                <div className="rating-stars">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className={`star-btn ${star <= (hoverRating || rating) ? 'active' : ''}`}
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      aria-label={`Rate ${star} stars`}
                    >
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                    </button>
                  ))}
                </div>
                <div className="rating-labels">
                  <span>Poor</span>
                  <span>Excellent</span>
                </div>
              </div>

              {/* Category */}
              <div className="form-group">
                <label className="form-label">
                  Feedback Category <span className="required">*</span>
                </label>
                <div className="category-grid">
                  {categories.map((cat) => (
                    <button
                      key={cat.value}
                      type="button"
                      className={`category-btn ${category === cat.value ? 'selected' : ''}`}
                      onClick={() => setCategory(cat.value)}
                    >
                      <span className="category-icon">{cat.icon}</span>
                      <span className="category-label">{cat.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Message */}
              <div className="form-group">
                <label className="form-label" htmlFor="feedback-message">
                  Your Feedback <span className="required">*</span>
                </label>
                <textarea
                  id="feedback-message"
                  className="form-textarea"
                  placeholder="Tell us about your experience..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows="4"
                  required
                />
                <div className="char-count">{message.length}/500</div>
              </div>

              {/* Email (Optional) */}
              <div className="form-group">
                <label className="form-label" htmlFor="feedback-email">
                  Email (Optional)
                </label>
                <input
                  id="feedback-email"
                  type="email"
                  className="form-input"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <small className="form-hint">We'll only use this to follow up on your feedback</small>
              </div>

              {/* Submit Button */}
              <button 
                type="submit" 
                className="submit-btn"
                disabled={isSubmitting || !rating || !category || !message.trim()}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner"></span>
                    Submitting...
                  </>
                ) : (
                  <>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Submit Feedback
                  </>
                )}
              </button>
            </form>
          </>
        ) : (
          <div className="feedback-success">
            <div className="success-icon">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                <path d="M8 12L11 15L16 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3>Thank You!</h3>
            <p>Your feedback has been submitted successfully.</p>
            <p className="success-subtext">We appreciate you taking the time to help us improve.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedbackModal;
