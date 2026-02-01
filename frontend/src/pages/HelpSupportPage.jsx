import { useState } from "react";
import "./HelpSupportPage.css";

export default function HelpSupportPage({ user, onBack }) {
  const [activeSection, setActiveSection] = useState('faq');
  const [searchQuery, setSearchQuery] = useState('');
  const [contactForm, setContactForm] = useState({
    subject: '',
    category: 'booking',
    message: '',
    priority: 'medium'
  });
  const [submitting, setSubmitting] = useState(false);

  const faqData = [
    {
      category: 'Booking',
      questions: [
        {
          q: 'How do I book movie tickets?',
          a: 'You can book tickets by selecting a movie, choosing your preferred showtime, selecting seats, and completing the payment process. You\'ll receive a confirmation email with your ticket details.'
        },
        {
          q: 'Can I cancel or modify my booking?',
          a: 'Yes, you can cancel your booking up to 2 hours before the showtime. Modifications depend on seat availability. Cancellation charges may apply as per our policy.'
        },
        {
          q: 'What payment methods do you accept?',
          a: 'We accept all major credit/debit cards, digital wallets (eSewa, Khalti), and mobile banking. All transactions are secured with SSL encryption.'
        },
        {
          q: 'How do I get my tickets?',
          a: 'After successful payment, you\'ll receive an email with your e-ticket. You can also download it from the "My Bookings" section. Show the QR code at the cinema for entry.'
        }
      ]
    },
    {
      category: 'Account',
      questions: [
        {
          q: 'How do I create an account?',
          a: 'Click on "Sign Up" and provide your email, phone number, and create a password. You\'ll receive a verification email to activate your account.'
        },
        {
          q: 'I forgot my password. What should I do?',
          a: 'Click on "Forgot Password" on the login page, enter your email address, and we\'ll send you a password reset link.'
        },
        {
          q: 'How do I update my profile information?',
          a: 'Go to "My Profile" from the user menu, click "Edit Profile", make your changes, and save. Some changes may require email verification.'
        }
      ]
    },
    {
      category: 'Cinema',
      questions: [
        {
          q: 'What are your cinema locations?',
          a: 'We have locations at QFX Jai Nepal (Chabahil), FCube Labim Mall (Lalitpur), and Big Movies Civil Mall (Sundhara). Each location offers premium viewing experiences.'
        },
        {
          q: 'What facilities do you provide?',
          a: 'Our cinemas feature comfortable seating, advanced sound systems, high-quality projection, air conditioning, parking facilities, and concession stands.'
        },
        {
          q: 'Do you have special screenings?',
          a: 'Yes, we offer IMAX screenings, 3D movies, and special premiere shows. Check our "Now Showing" section for available formats.'
        }
      ]
    },
    {
      category: 'Technical',
      questions: [
        {
          q: 'The website is not loading properly. What should I do?',
          a: 'Try refreshing the page, clearing your browser cache, or using a different browser. If the issue persists, contact our support team.'
        },
        {
          q: 'I\'m not receiving booking confirmation emails.',
          a: 'Check your spam/junk folder. Add our email to your contacts. If you still don\'t receive emails, contact support with your booking reference.'
        },
        {
          q: 'The payment failed but money was deducted.',
          a: 'Don\'t worry! If payment fails, the amount is usually refunded within 3-5 business days. Contact support with transaction details for faster resolution.'
        }
      ]
    }
  ];

  const contactCategories = [
    { value: 'booking', label: 'Booking Issues' },
    { value: 'payment', label: 'Payment Problems' },
    { value: 'technical', label: 'Technical Support' },
    { value: 'feedback', label: 'Feedback & Suggestions' },
    { value: 'other', label: 'Other' }
  ];

  const filteredFAQs = faqData.map(category => ({
    ...category,
    questions: category.questions.filter(
      item => 
        item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.a.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      // In a real app, you'd submit to your API
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
      alert('Your message has been sent successfully! We\'ll get back to you within 24 hours.');
      setContactForm({
        subject: '',
        category: 'booking',
        message: '',
        priority: 'medium'
      });
    } catch (error) {
      console.error('Error submitting contact form:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setContactForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="help-support-page">
      <div className="help-header">
        <button className="back-button" onClick={onBack}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5" stroke="currentColor" strokeWidth="2"/>
            <path d="M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2"/>
          </svg>
          Back to Home
        </button>
        <h1>Help & Support</h1>
      </div>

      <div className="help-container">
        <div className="help-sidebar">
          <div className="help-tabs">
            <button
              className={`help-tab ${activeSection === 'faq' ? 'active' : ''}`}
              onClick={() => setActiveSection('faq')}
            >
              <span className="tab-icon">❓</span>
              <span className="tab-label">FAQ</span>
            </button>
            <button
              className={`help-tab ${activeSection === 'contact' ? 'active' : ''}`}
              onClick={() => setActiveSection('contact')}
            >
              <span className="tab-icon">📧</span>
              <span className="tab-label">Contact Us</span>
            </button>
            <button
              className={`help-tab ${activeSection === 'guides' ? 'active' : ''}`}
              onClick={() => setActiveSection('guides')}
            >
              <span className="tab-icon">📖</span>
              <span className="tab-label">User Guides</span>
            </button>
          </div>

          <div className="quick-contact">
            <h3>Need Immediate Help?</h3>
            <div className="contact-options">
              <div className="contact-option">
                <div className="contact-icon">📞</div>
                <div className="contact-info">
                  <span className="contact-label">Phone Support</span>
                  <span className="contact-value">+977-1-4444444</span>
                </div>
              </div>
              <div className="contact-option">
                <div className="contact-icon">💬</div>
                <div className="contact-info">
                  <span className="contact-label">Live Chat</span>
                  <span className="contact-value">Available 24/7</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="help-main">
          {activeSection === 'faq' && (
            <div className="faq-section">
              <div className="section-header">
                <h2>Frequently Asked Questions</h2>
                <div className="search-container">
                  <input
                    type="text"
                    placeholder="Search FAQs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-input"
                  />
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="search-icon">
                    <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
                    <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </div>
              </div>

              {filteredFAQs.length === 0 ? (
                <div className="no-results">
                  <div className="no-results-icon">🔍</div>
                  <h3>No results found</h3>
                  <p>Try different keywords or browse categories below.</p>
                </div>
              ) : (
                <div className="faq-categories">
                  {filteredFAQs.map((category, categoryIndex) => (
                    <div key={categoryIndex} className="faq-category">
                      <h3 className="category-title">{category.category}</h3>
                      <div className="faq-items">
                        {category.questions.map((item, itemIndex) => (
                          <details key={itemIndex} className="faq-item">
                            <summary className="faq-question">
                              {item.q}
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="expand-icon">
                                <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2"/>
                              </svg>
                            </summary>
                            <div className="faq-answer">
                              <p>{item.a}</p>
                            </div>
                          </details>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeSection === 'contact' && (
            <div className="contact-section">
              <h2>Contact Support</h2>
              <p className="section-description">
                Can't find what you're looking for? Send us a message and we'll get back to you within 24 hours.
              </p>

              <form onSubmit={handleContactSubmit} className="contact-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Subject</label>
                    <input
                      type="text"
                      name="subject"
                      value={contactForm.subject}
                      onChange={handleInputChange}
                      placeholder="Brief description of your issue"
                      required
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>Category</label>
                    <select
                      name="category"
                      value={contactForm.category}
                      onChange={handleInputChange}
                      className="form-input"
                    >
                      {contactCategories.map(cat => (
                        <option key={cat.value} value={cat.value}>{cat.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Priority</label>
                  <div className="priority-options">
                    {['low', 'medium', 'high', 'urgent'].map(priority => (
                      <label key={priority} className="radio-label">
                        <input
                          type="radio"
                          name="priority"
                          value={priority}
                          checked={contactForm.priority === priority}
                          onChange={handleInputChange}
                        />
                        <span className={`priority-badge ${priority}`}>
                          {priority.charAt(0).toUpperCase() + priority.slice(1)}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label>Message</label>
                  <textarea
                    name="message"
                    value={contactForm.message}
                    onChange={handleInputChange}
                    placeholder="Please provide detailed information about your issue..."
                    required
                    rows="6"
                    className="form-input"
                  />
                </div>

                <button type="submit" className="submit-btn" disabled={submitting}>
                  {submitting ? (
                    <>
                      <div className="loading-spinner-small"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <line x1="22" y1="2" x2="11" y2="13" stroke="currentColor" strokeWidth="2"/>
                        <polygon points="22,2 15,22 11,13 2,9 22,2" stroke="currentColor" strokeWidth="2"/>
                      </svg>
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {activeSection === 'guides' && (
            <div className="guides-section">
              <h2>User Guides</h2>
              <p className="section-description">
                Step-by-step guides to help you make the most of RTX Cinema.
              </p>

              <div className="guides-grid">
                <div className="guide-card">
                  <div className="guide-icon">🎫</div>
                  <h3>How to Book Tickets</h3>
                  <p>Learn how to search for movies, select seats, and complete your booking in just a few clicks.</p>
                  <button className="guide-btn">Read Guide</button>
                </div>

                <div className="guide-card">
                  <div className="guide-icon">💳</div>
                  <h3>Payment Methods</h3>
                  <p>Understand all available payment options and how to ensure secure transactions.</p>
                  <button className="guide-btn">Read Guide</button>
                </div>

                <div className="guide-card">
                  <div className="guide-icon">👤</div>
                  <h3>Managing Your Account</h3>
                  <p>Update your profile, manage preferences, and keep your account secure.</p>
                  <button className="guide-btn">Read Guide</button>
                </div>

                <div className="guide-card">
                  <div className="guide-icon">📱</div>
                  <h3>Mobile Experience</h3>
                  <p>Get the best experience when using RTX Cinema on your mobile device.</p>
                  <button className="guide-btn">Read Guide</button>
                </div>

                <div className="guide-card">
                  <div className="guide-icon">🎬</div>
                  <h3>Cinema Etiquette</h3>
                  <p>Guidelines for a great movie experience for everyone at our cinemas.</p>
                  <button className="guide-btn">Read Guide</button>
                </div>

                <div className="guide-card">
                  <div className="guide-icon">🔄</div>
                  <h3>Refunds & Cancellations</h3>
                  <p>Learn about our refund policy and how to cancel or modify bookings.</p>
                  <button className="guide-btn">Read Guide</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}