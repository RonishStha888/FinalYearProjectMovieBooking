import { useState, useEffect } from "react";
import "./ProfilePage.css";
import { API_URL } from '../config';

export default function ProfilePage({ user, onBack }) {
  const [profileData, setProfileData] = useState({
    name: user?.name || user?.login || '',
    email: user?.email || '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    address: '',
    city: 'Kathmandu',
    membershipType: 'Premium Member',
    joinDate: new Date().toLocaleDateString(),
    totalBookings: 0,
    favoriteGenres: []
  });
  
  const [loyaltyData, setLoyaltyData] = useState(null);
  const [pointsHistory, setPointsHistory] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loyaltyLoading, setLoyaltyLoading] = useState(true);

  useEffect(() => {
    console.log('ProfilePage mounted with user:', user);
    fetchUserProfile();
    if (user && user._id) {
      fetchLoyaltyData();
    } else {
      console.error('User or user._id is missing:', user);
      setLoyaltyLoading(false);
    }
  }, []);

  const fetchUserProfile = async () => {
    try {
      // In a real app, you'd fetch from your API
      // For now, we'll use mock data
      setProfileData(prev => ({
        ...prev,
        phone: '+977-9841234567',
        dateOfBirth: '1995-06-15',
        gender: 'Male',
        address: 'Thamel, Kathmandu',
        totalBookings: 12,
        favoriteGenres: ['Action', 'Sci-Fi', 'Drama']
      }));
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const fetchLoyaltyData = async () => {
    try {
      setLoyaltyLoading(true);
      console.log('Fetching loyalty data for user:', user._id);
      const response = await fetch(`${API_URL}/api/loyalty/user/${user._id}`);
      const data = await response.json();
      
      console.log('Loyalty data response:', data);
      
      if (data.success) {
        setLoyaltyData({
          points: data.loyaltyPoints,
          tierInfo: data.tierInfo,
          redemptionOptions: data.redemptionOptions
        });
        setPointsHistory(data.recentHistory || []);
      } else {
        console.error('Failed to fetch loyalty data:', data.message);
        // Set default Bronze tier data if API fails
        setLoyaltyData({
          points: {
            total: 0,
            available: 0,
            lifetime: 0,
            tier: 'Bronze'
          },
          tierInfo: {
            name: 'Bronze',
            icon: '🥉',
            color: '#CD7F32',
            benefits: ['Earn 10 points per ticket', 'Earn 5 points per Rs. 100 spent', 'Redeem points for discounts'],
            nextTier: 'Silver',
            pointsNeeded: 500
          },
          redemptionOptions: []
        });
      }
    } catch (error) {
      console.error('Error fetching loyalty data:', error);
      // Set default Bronze tier data on error
      setLoyaltyData({
        points: {
          total: 0,
          available: 0,
          lifetime: 0,
          tier: 'Bronze'
        },
        tierInfo: {
          name: 'Bronze',
          icon: '🥉',
          color: '#CD7F32',
          benefits: ['Earn 10 points per ticket', 'Earn 5 points per Rs. 100 spent', 'Redeem points for discounts'],
          nextTier: 'Silver',
          pointsNeeded: 500
        },
        redemptionOptions: []
      });
    } finally {
      setLoyaltyLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // In a real app, you'd save to your API
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-header">
        <button className="back-button" onClick={onBack}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5" stroke="currentColor" strokeWidth="2"/>
            <path d="M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2"/>
          </svg>
          Back to Home
        </button>
        <h1>My Profile</h1>
      </div>

      <div className="profile-container">
        <div className="profile-sidebar">
          <div className="profile-avatar-section">
            <div className="profile-avatar-large">
              <span>{profileData.name[0]?.toUpperCase() || 'U'}</span>
            </div>
            <h2>{profileData.name}</h2>
            <p className="membership-badge">{profileData.membershipType}</p>
            <p className="join-date">Member since {profileData.joinDate}</p>
          </div>

          {/* Loyalty Points Section */}
          {loyaltyLoading ? (
            <div className="loyalty-section">
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px' }}>
                <div className="loading-spinner-small"></div>
                <p style={{ textAlign: 'center', marginTop: '10px', color: 'rgba(255,255,255,0.6)', fontSize: '14px' }}>Loading loyalty data...</p>
              </div>
            </div>
          ) : loyaltyData ? (
            <div className="loyalty-section">
              <div className="loyalty-header">
                <h3>Loyalty Rewards</h3>
                <span className="tier-badge" style={{ backgroundColor: loyaltyData.tierInfo.color }}>
                  {loyaltyData.tierInfo.name}
                </span>
              </div>
              
              <div className="points-display">
                <div className="points-main">
                  <div className="points-number">{loyaltyData.points.available}</div>
                  <div className="points-label">Available Points</div>
                </div>
                <div className="points-value">
                  ≈ Rs. {Math.floor(loyaltyData.points.available / 2)}
                </div>
              </div>

              <div className="tier-progress">
                <div className="progress-label">
                  <span>Lifetime Points: {loyaltyData.points.lifetime}</span>
                  {loyaltyData.tierInfo.nextTier && (
                    <span className="next-tier">
                      {loyaltyData.tierInfo.pointsNeeded - loyaltyData.points.lifetime} to {loyaltyData.tierInfo.nextTier}
                    </span>
                  )}
                </div>
                {loyaltyData.tierInfo.nextTier && (
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ 
                        width: `${Math.min((loyaltyData.points.lifetime / loyaltyData.tierInfo.pointsNeeded) * 100, 100)}%`,
                        backgroundColor: loyaltyData.tierInfo.color
                      }}
                    ></div>
                  </div>
                )}
              </div>

              <div className="tier-benefits">
                <h4>Your Benefits</h4>
                <ul>
                  {loyaltyData.tierInfo.benefits.map((benefit, index) => (
                    <li key={index}>✓ {benefit}</li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="loyalty-section">
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px' }}>
                  Unable to load loyalty data. Please check console for details.
                </p>
              </div>
            </div>
          )}

          <div className="profile-stats">
            <div className="stat-item">
              <div className="stat-number">{profileData.totalBookings}</div>
              <div className="stat-label">Total Bookings</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">{profileData.favoriteGenres.length}</div>
              <div className="stat-label">Favorite Genres</div>
            </div>
          </div>
        </div>

        <div className="profile-main">
          <div className="profile-section">
            <div className="section-header">
              <h3>Personal Information</h3>
              <button 
                className={`edit-button ${isEditing ? 'save' : ''}`}
                onClick={isEditing ? handleSave : () => setIsEditing(true)}
                disabled={loading}
              >
                {loading ? (
                  <div className="loading-spinner-small"></div>
                ) : isEditing ? (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                    Save Changes
                  </>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" strokeWidth="2"/>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                    Edit Profile
                  </>
                )}
              </button>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={profileData.name}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={profileData.email}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={profileData.phone}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Date of Birth</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={profileData.dateOfBirth}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Gender</label>
                <select
                  name="gender"
                  value={profileData.gender}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="form-input"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label>City</label>
                <select
                  name="city"
                  value={profileData.city}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="form-input"
                >
                  <option value="Kathmandu">Kathmandu</option>
                  <option value="Pokhara">Pokhara</option>
                  <option value="Lalitpur">Lalitpur</option>
                  <option value="Bhaktapur">Bhaktapur</option>
                </select>
              </div>

              <div className="form-group full-width">
                <label>Address</label>
                <textarea
                  name="address"
                  value={profileData.address}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="form-input"
                  rows="3"
                />
              </div>
            </div>
          </div>

          <div className="profile-section">
            <h3>Preferences</h3>
            <div className="preferences-grid">
              <div className="preference-item">
                <h4>Favorite Genres</h4>
                <div className="genre-tags">
                  {profileData.favoriteGenres.map((genre, index) => (
                    <span key={index} className="genre-tag">{genre}</span>
                  ))}
                </div>
              </div>
              
              <div className="preference-item">
                <h4>Notifications</h4>
                <div className="notification-settings">
                  <label className="checkbox-label">
                    <input type="checkbox" defaultChecked />
                    <span>Email notifications for new movies</span>
                  </label>
                  <label className="checkbox-label">
                    <input type="checkbox" defaultChecked />
                    <span>SMS notifications for bookings</span>
                  </label>
                  <label className="checkbox-label">
                    <input type="checkbox" />
                    <span>Promotional offers</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Points History Section */}
          {pointsHistory.length > 0 && (
            <div className="profile-section">
              <h3>Recent Points Activity</h3>
              <div className="points-history">
                {pointsHistory.map((entry, index) => (
                  <div key={index} className="history-item">
                    <div className="history-icon">
                      {entry.type === 'earned' ? '+' : 'B'}
                    </div>
                    <div className="history-details">
                      <div className="history-description">{entry.description}</div>
                      <div className="history-date">
                        {new Date(entry.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                    <div className={`history-points ${entry.type}`}>
                      {entry.type === 'earned' ? '+' : '-'}{entry.points}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}